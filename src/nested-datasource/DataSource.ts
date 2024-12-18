import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import { getBackendSrv, isFetchError } from '@grafana/runtime';
import { DataSourceResponse, defaultQuery, MyDataSourceOptions, MyQuery } from './types';
import { lastValueFrom } from 'rxjs';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;
  user: string;
  password: string;

  private cache: Record<string, Array<{ timestamp: number; value: number }>> = {};

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  
    const keywordMap = Object.fromEntries(
      (instanceSettings.meta.info as any)?.keywords.map((k: string) => k.split('=')) || []
    );    
  
    this.baseUrl = keywordMap['DITTO_API_URL'] || '';
    this.user = keywordMap['DITTO_API_USER'] || '';
    this.password = keywordMap['DITTO_API_PASSWORD'] || '';
  }
  
  getBaseUrl() {
    return this.baseUrl;
  }

  getUser() {
    return this.user;
  }

  getPassword() {
    return this.password;
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return defaultQuery;
  }

  filterQuery(query: MyQuery): boolean {
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const data = await Promise.all(
      options.targets.map(async target => {
        const fullUrl = `${this.baseUrl}/things/${target.thingID}/${target.queryText}`;

        // Fetch the latest data
        const response = await getBackendSrv().datasourceRequest({
          url: fullUrl,
          method: 'GET',
          headers: {
            Authorization: `Basic ${btoa(`${this.user}:${this.password}`)}`,
          },
        });

        // Extract the value from the API response
        const newValue = response.data; // Ensure the API returns a numeric value
        const timestamp = Date.now(); // Use the current time as the timestamp

        // Update the in-memory cache for this target
        const refId = target.refId || 'default';
        if (!this.cache[refId]) {
          this.cache[refId] = [];
        }
        this.cache[refId].push({ timestamp, value: newValue });

        // Create a DataFrame with all cached data
        const frame = new MutableDataFrame({
          refId,
          fields: [
            { name: 'Time', type: FieldType.time },
            { name: 'Value', type: FieldType.number },
          ],
        });

        // Populate the DataFrame with cached values
        this.cache[refId].forEach(point => {
          frame.appendRow([point.timestamp, point.value]);
        });

        return frame;
      })
    );

    return { data };
  }

  async request(url: string, params?: string) {
    const response = getBackendSrv().fetch<DataSourceResponse>({
      url: `${this.baseUrl}${url}${params?.length ? `?${params}` : ''}`,
    });
    return lastValueFrom(response);
  }

  /**
   * Checks whether we can connect to the API.
   */
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request('/health');
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
