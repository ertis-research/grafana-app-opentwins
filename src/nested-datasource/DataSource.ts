import {
  arrayToDataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
} from '@grafana/data';
import { FetchResponse, getBackendSrv, isFetchError, getTemplateSrv } from '@grafana/runtime';
import { BasicDataSourceOptions, DataSourceResponse, MyQuery } from './types';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MyVariableSupport } from './VariableSupport';

export class DataSource extends DataSourceApi<MyQuery, BasicDataSourceOptions> {
  baseUrl: string;
  path: string;
  url: string;
  routePath = "/ditto";

  private cache: Record<string, Array<{ timestamp: number; value: number }>> = {};

  constructor(instanceSettings: DataSourceInstanceSettings<BasicDataSourceOptions>) {
    super(instanceSettings);

    const { url = '', path = '' } = instanceSettings.jsonData;

    this.baseUrl = url;
    this.url = instanceSettings.url!;
    this.path = path;
  
    this.variables = new MyVariableSupport(this);
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
    const data = await Promise.all(
      options.targets.map(async target => {
        // Fetch the latest data

        const rawThingID = target.thingID ?? '${ThingID}';

        const resolvedThingID = getTemplateSrv().replace(rawThingID, options.scopedVars);

        const response = await firstValueFrom(getBackendSrv().fetch({
          url: this.url + this.routePath + `/${this.path}/things/${resolvedThingID}/features/${target.queryText}`,
          method: 'GET',
        })) as FetchResponse<number>;

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
        const rows = this.cache[refId].map(point => ({
          Time: point.timestamp,
          Value: point.value,
        }));

        // 2) create the DataFrame (it will infer field names/types)
        const frame = arrayToDataFrame(rows);

        // 3) set your refId metadata
        frame.refId = refId;

        // 4) override any field types that weren’t inferred correctly
        //    (here “Time” should be timestamp, “Value” numeric)
        const timeField = frame.fields.find(f => f.name === 'Time');
        if (timeField) {
          timeField.type = FieldType.time;
        }

        const valueField = frame.fields.find(f => f.name === 'Value');
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
          url: this.url + this.routePath + "/health",
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
}
