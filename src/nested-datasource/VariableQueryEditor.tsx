import React, { useEffect, useState } from 'react';
import { InlineField, Select } from '@grafana/ui';
import { VariableQueryEditorProps } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { firstValueFrom } from 'rxjs';
import { DataSource } from './DataSource';
import { MyDataSourceOptions } from './types';

interface MyVariableQuery {
  queryType?: string;
}

export function VariableQueryEditor(props: VariableQueryEditorProps<DataSource, MyVariableQuery, MyDataSourceOptions>) {
  const { query, onChange } = props;
  const datasource = props.datasource;

  const [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    const fetchThingIds = async () => {
      try {
        const response = await firstValueFrom(
          getBackendSrv().fetch<any[]>({
            url: `${datasource.getUrl()}${datasource.getRoutePath()}/${datasource.getPath()}/things?option=size(200)`,
            method: 'GET',
          })
        );

        const res = response.data.map((item: any) => ({
          label: item.thingId,
          value: item.thingId,
        }));
        setOptions(res);
      } catch (error) {
        console.error('Failed to load variable options:', error);
      }
    };

    fetchThingIds();
  }, []);

  return (
    <InlineField label="Thing ID">
      <Select
        options={options}
        value={query.queryType || ''}
        onChange={(v) => onChange({ ...query, queryType: v.value })}
        placeholder="Select thing ID"
      />
    </InlineField>
  );
}
