import React, { ReactElement } from 'react';
import { InlineField, Input, SecretInput } from '@grafana/ui';
import type { EditorProps } from './types';
import { useChangeOptions } from './useChangeOptions';
import { useChangeSecureOptions } from './useChangeSecureOptions';
import { useResetSecureOptions } from './useResetSecureOptions';

export function ConfigEditor(props: EditorProps): ReactElement {

  const { jsonData, secureJsonData, secureJsonFields } = props.options;
  const onUrlFieldChange = useChangeOptions(props, 'url');
  const onPathFieldChange = useChangeOptions(props, 'path');
  const onApiAuthFieldChange = useChangeSecureOptions(props, 'apiAuth');
  const onResetApiAuth = useResetSecureOptions(props, 'apiAuth');

  return (
    <>
      <InlineField label="Url" labelWidth={26} interactive tooltip={'Json field returned to frontend'}>
        <Input
          id="config-url"
          onChange={onUrlFieldChange}
          value={jsonData.url}
          placeholder="Enter Eclipse IoT URL"
          width={40}
        />
      </InlineField>
      <InlineField label="Path" labelWidth={26} interactive tooltip={'Json field returned to frontend'}>
        <Input
          id="config-path"
          onChange={onPathFieldChange}
          value={jsonData.path}
          placeholder="Enter Eclipse IoT path"
          width={40}
        />
      </InlineField>
      <InlineField label="API Auth Key" labelWidth={26} interactive tooltip={'Secure json field (backend only)'}>
        <SecretInput
          required
          id="config-editor-api-key"
          isConfigured={secureJsonFields.apiAuth}
          value={secureJsonData?.apiAuth}
          placeholder="Enter your API Authorization Key"
          width={40}
          onReset={onResetApiAuth}
          onChange={onApiAuthFieldChange}
        />
      </InlineField>
    </>
  );
}
