// VariableSupport.ts
import { CustomVariableSupport, DataQueryRequest } from '@grafana/data';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { getBackendSrv } from '@grafana/runtime';

import { DataSource } from './DataSource';
import { MyQuery } from './types';
import { VariableQueryEditor } from './VariableQueryEditor';

export class MyVariableSupport extends CustomVariableSupport<DataSource> {
  constructor(private datasource: DataSource) {
    super();
  }

  editor = VariableQueryEditor;

  query(request: DataQueryRequest<MyQuery>) {
    const url = `${this.datasource.getUrl()}${this.datasource.getRoutePath()}/${this.datasource.getPath()}/things`;

    return from(
      getBackendSrv().fetch<{ thingId: string }[]>({
        url,
        method: 'GET',
      })
    ).pipe(
      map((response) => {
        const data = response.data.map((item) => ({
          text: item.thingId,
          value: item.thingId,
        }));
        return { data };
      })
    );
  }
}
