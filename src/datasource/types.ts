import type { DataSourceJsonData, DataSourcePluginOptionsEditorProps } from '@grafana/data';
import type { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  queryText?: string;
  thingID?: string;
}

export interface DataPoint {
  Time: number;
  Value: number;
}
export interface DataSourceResponse {
  datapoints: DataPoint[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

export interface BasicDataSourceOptions extends DataSourceJsonData {
  url?: string;
  path?: string;
  wsUrl?: string;
}

export interface BasicSecureJsonData {
  apiAuth?: string;
}

export type EditorProps = DataSourcePluginOptionsEditorProps<BasicDataSourceOptions, BasicSecureJsonData>;
