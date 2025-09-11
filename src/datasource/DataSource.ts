import {
  MutableDataFrame,
  arrayToDataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  ThresholdsMode,
} from '@grafana/data';
import { FetchResponse, getBackendSrv, isFetchError, getTemplateSrv } from '@grafana/runtime';
import { BasicDataSourceOptions, DataSourceResponse, MyQuery } from './types';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MyVariableSupport } from './VariableSupport';

export class DataSource extends DataSourceApi<MyQuery, BasicDataSourceOptions> {
  baseUrl: string;
  path: string;
  url: string;
  routePath = '/ditto';

  private cache: Record<string, Array<{ timestamp: number; value: number }>> = {};

  private alertState = {
    value: null as number | null,
    timestamp: 0,
    alertFlag: 0
  };

  private collisionTimer: NodeJS.Timeout | null = null;
  private connectionTimer: NodeJS.Timeout | null = null;

  private collisionExpired = false;

  constructor(instanceSettings: DataSourceInstanceSettings<BasicDataSourceOptions>) {
    super(instanceSettings);

    const { url = '', path = '' } = instanceSettings.jsonData;

    this.baseUrl = url;
    this.url = instanceSettings.url!;
    this.path = path;

    this.variables = new MyVariableSupport(this);

    this.connectToDittoWebSocket();
  }

  getUrl() {
    return this.url;
  }

  getRoutePath() {
    return this.routePath;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getPath() {
    return this.path;
  }

  filterQuery(query: MyQuery): boolean {
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    for (const target of options.targets) {
      if (target.queryText === 'advisedSpeed') {
        const frame = new MutableDataFrame({
          refId: target.refId,
          fields: [
            { name: 'Time', type: FieldType.time, values: [this.alertState.timestamp] },
            {
              name: 'advisedSpeed',
              type: FieldType.number,
              values: [this.alertState.value],
              config: {
                thresholds: {
                  mode: ThresholdsMode.Absolute,
                  steps: [
                    {
                      color: 
                        this.alertState.alertFlag === 2 
                        ? 'red' 
                        : this.alertState.alertFlag === 1 
                        ? 'yellow' 
                        : 'green',
                      value: 0
                    }
                  ],
                },
              },
            },
          ],
        });

        return Promise.resolve({ data: [frame] });
      }
    }

    const data = await Promise.all(
      options.targets.map(async (target) => {
        // Fetch the latest data

        const rawThingID = target.thingID ?? '${ThingID}';
        const resolvedThingID = getTemplateSrv().replace(rawThingID, options.scopedVars);
        
        const resolvedQueryText = getTemplateSrv().replace(target.queryText);

        const response = (await firstValueFrom(
          getBackendSrv().fetch({
            url: this.url + this.routePath + `/${this.path}/things/${resolvedThingID}/features/${resolvedQueryText}`,
            method: 'GET',
          })
        )) as FetchResponse<number>;

        // Extract the value from the API response
        const newValue = response.data; // Ensure the API returns a numeric value
        const timestamp = Date.now(); // Use the current time as the timestamp

        // Update the in-memory cache for this target
        const refId = target.refId || 'default';
        if (!this.cache[refId]) {
          this.cache[refId] = [];
        }
        this.cache[refId].push({ timestamp, value: newValue });

        // 1) build an array of row‑objects
        const rows = this.cache[refId].map((point) => ({
          Time: point.timestamp,
          Value: point.value,
        }));

        // 2) create the DataFrame (it will infer field names/types)
        const frame = arrayToDataFrame(rows);

        // 3) set your refId metadata
        frame.refId = refId;

        // 4) override any field types that weren’t inferred correctly
        //    (here “Time” should be timestamp, “Value” numeric)
        const timeField = frame.fields.find((f) => f.name === 'Time');
        if (timeField) {
          timeField.type = FieldType.time;
        }

        const valueField = frame.fields.find((f) => f.name === 'Value');
        if (valueField) {
          valueField.type = FieldType.number;
        }

        return frame;
      })
    );

    return { data };
  }

  /**
   * Checks whether we can connect to the API.
   */
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await lastValueFrom(
        getBackendSrv().fetch<DataSourceResponse>({
          url: this.url + this.routePath + '/health',
          method: 'GET',
        })
      );
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = defaultErrorMessage;
      if (typeof err === 'string') {
        message = err;
      } else if (isFetchError(err)) {
        message = `Fetch error: ${err.data.error?.message ?? err.statusText}`;
      }
      return {
        status: 'error',
        message,
      };
    }
  }

  private connectToDittoWebSocket(): void {
    const ws = new WebSocket('ws://ditto:ditto@10.255.41.221:8080/ws/2'); // replace with your real address

    ws.onopen = () => {
      console.log('[Ditto WS] Connected');
      ws.send('START-SEND-MESSAGES');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const stringValue = message?.value;
        const value = typeof stringValue === 'string' ? JSON.parse(stringValue) : stringValue;
        const collision = value?.collision;
        const advisedSpeed = value?.advisedSpeed;     
        
        if (collision) { // If collision detected, set alert to yellow
          this.alertState.alertFlag = 1; // yellow
          this.alertState.value = advisedSpeed;
          this.alertState.timestamp = Date.now();

          // Reset timer and flag
          if (this.collisionTimer) { clearTimeout(this.collisionTimer); }
          this.collisionExpired = false;

          // Start 5s timer ONLY once a collision is detected
          this.collisionTimer = setTimeout(() => {
            this.collisionExpired = true;
            console.log('[Ditto WS] Collision alert expired');
          }, 5000);

        } else {
          if (this.collisionExpired) { // If collision expired, reset to green when no collision
            this.alertState.alertFlag = 0; 
            this.alertState.value = advisedSpeed;
            this.alertState.timestamp = Date.now();
          }
        }

        // connectionTimer to assert the connection is still alive (or not)
        if (this.connectionTimer) { clearTimeout(this.connectionTimer); }

        this.connectionTimer = setTimeout(() => {
          this.alertState.alertFlag = 2; // red
          this.alertState.value = null;
          this.alertState.timestamp = Date.now();
          console.warn('[Ditto WS] No message received in 3s — setting red alert');
        }, 3000);    
        
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('[Ditto WS] Error:', err);
    };

    ws.onclose = () => {
      console.warn('[Ditto WS] Connection closed. Reconnecting in 5s...');
      setTimeout(() => this.connectToDittoWebSocket(), 5000);
    };
  }
}
