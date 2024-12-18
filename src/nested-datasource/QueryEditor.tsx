import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
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

  const onThingIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, thingID: event.target.value });
  };

  const onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, constant: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  const { queryText, constant, thingID } = query;

  let context = emptyContext
  context.ditto_extended_endpoint = datasource.getBaseUrl()

  let twins = fetchExtendedApiForDittoService(context, "/things?option=size(200)", {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa(`${datasource.getUser()}:${datasource.getPassword()}`),
        "Accept": "application/json"
      }
    })

  console.log(twins)

  return (
    <>
      <InlineField label="Constant" labelWidth={14}>
        <Input id="query-editor-constant" onChange={onConstantChange} value={constant} type="number" step="0.1" />
      </InlineField>
      <InlineField label="Thing ID" labelWidth={14} tooltip="Not used yet">
        <Input
          id="query-editor-thing-id"
          onChange={onThingIDChange}
          value={thingID || ''}
          required
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
