import React, { ChangeEvent, useEffect, useState } from 'react';
import { InlineField, Input, Select } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery } from './types';
import { fetchExtendedApiForDittoService } from "../services/general/fetchExtendedApiService"
import { emptyContext } from 'utils/context/staticContext';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const onThingIDChange = (value: string | undefined) => {
    onChange({ ...query, thingID: value });
  };

  const onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, constant: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  const { queryText, constant, thingID } = query;
  const [ids, setIds] = useState<Array<{ label: string; value: string }>>([]);
  
  useEffect(() => {
    const fetchThingIds = async () => {
      let context = { ...emptyContext };
      context.ditto_extended_endpoint = datasource.getBaseUrl();

      try {
        let twins = await fetchExtendedApiForDittoService(context, "/things?option=size(200)", {
          method: 'GET',
          headers: {
            Authorization: 'Basic ' + btoa(`${datasource.getUser()}:${datasource.getPassword()}`),
            Accept: "application/json",
          },
        });

        let res = twins.map((item: any) => ({
          label: item.thingId, // Displayed text
          value: item.thingId, // Actual value
        }));
        setIds(res);

      } catch (error) {
        console.error("Error fetching thing IDs:", error);
      }
    };

    fetchThingIds();
  }, []);

  return (
    <>
      <InlineField label="Constant" labelWidth={14}>
        <Input id="query-editor-constant" onChange={onConstantChange} value={constant} type="number" step="0.1" />
      </InlineField>
      <InlineField label="Thing ID" labelWidth={14} tooltip="Not used yet">
        <Select
          id="query-editor-thing-id"
          options={ids}
          onChange={(option) => onThingIDChange(option.value)}
          value={thingID || ''}
          placeholder="Enter a query"
        />
      </InlineField>
      <InlineField label="Query Text" labelWidth={14} tooltip="Not used yet">
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
