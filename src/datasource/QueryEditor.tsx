import React, { ChangeEvent, useEffect, useState } from 'react';
import { InlineField, Input, Combobox, ComboboxOption } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery, QueryType } from './types';
import { emptyContext } from 'utils/context/staticContext';
import { FetchResponse, getBackendSrv } from '@grafana/runtime';
import { firstValueFrom } from 'rxjs';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const comboboxQueryTypeOptions: Array<ComboboxOption<QueryType>> = [
  { label: 'Features', value: QueryType.Features },
  { label: 'Messages', value: QueryType.Messages },
];

export const defaultQuery: Partial<MyQuery> = {
  queryType: QueryType.Features,
};

export function QueryEditor({ query, onChange, datasource }: Props) {
  query = { ...defaultQuery, ...query };

  const { queryType, queryText, thingID } = query;
  const [ids, setIds] = useState<ComboboxOption[]>([]);

  const onQueryTypeChange = (value: QueryType) => {
    onChange({ ...query, queryType: value });
  };

  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const onThingIDChange = (value: string | undefined) => {
    onChange({ ...query, thingID: value });
  };

  useEffect(() => {
    const fetchThingIds = async () => {
      let context = { ...emptyContext };
      context.ditto_extended_endpoint = datasource.getBaseUrl();

      try {
        const twinsResponse: FetchResponse<any[]> = await firstValueFrom(
          getBackendSrv().fetch<any[]>({
            url: datasource.getUrl() + datasource.getRoutePath() + `/${datasource.getPath()}/things?option=size(200)`,
            method: 'GET',
          })
        );

        const twins = twinsResponse.data;

        let res = twins.map((item: any) => ({
          label: item.thingId, // Displayed text
          value: item.thingId, // Actual value
        }));
        setIds(res);
      } catch (error) {
        console.error('Error fetching thing IDs:', error);
      }
    };

    fetchThingIds();
  }, []);

  return (
    <>
      <InlineField label="Query Type" labelWidth={20} tooltip="Not used yet">
        <Combobox
          id="query-editor-type"
          options={comboboxQueryTypeOptions}
          onChange={(option) => onQueryTypeChange(option.value)}
          value={queryType}
          placeholder="Chose the query type"
        />
      </InlineField>
      <InlineField label="Thing ID" labelWidth={20} tooltip="Not used yet">
        <Combobox
          id="query-editor-thing-id"
          createCustomValue={true}
          options={ids}
          onChange={(option) => onThingIDChange(option.value)}
          value={thingID || ''}
          placeholder="Chose the Thing ID"
        />
      </InlineField>
      <InlineField label="Property Path" labelWidth={20} tooltip="Not used yet">
        <Input
          id="query-editor-query-text"
          onChange={onQueryTextChange}
          value={queryText || ''}
          required
          placeholder="Enter a query"
        />
      </InlineField>
    </>
  );
}
