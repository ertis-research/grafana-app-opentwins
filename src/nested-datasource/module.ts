import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './DataSource';
import { QueryEditor } from './QueryEditor';
import { MyDataSourceOptions, MyQuery } from './types';
import { ConfigEditor } from './ConfigEditor';
import { VariableQueryEditor } from './VariableQueryEditor';

export const plugin = new DataSourcePlugin<DataSource, MyQuery, MyDataSourceOptions>(DataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryEditor(QueryEditor)
    .setVariableQueryEditor(VariableQueryEditor);
