// src/components/ConnectionForm/components/FormSections/SslSection.tsx
import React from 'react'
import { CodeEditor, Field } from '@grafana/ui'
import { SSLData } from 'utils/interfaces/connections'
import { Protocols } from '../ConnectionForm.types'
import { keys } from '../utils/constants'

interface Props {
    sslData: SSLData
    protocol: Protocols
    onBlur: (c: string, key: string, name: string) => void
}

export const SslSection: React.FC<Props> = ({ sslData, protocol, onBlur }) => {
    return (
        <div>
            <Field label="CA" description="A string of trusted certificates as PEM-encoded DER. Concatenate multiple certificates as strings to trust all of them. Omit to trust popular certificate authorities.">
                <CodeEditor value={sslData.ca} language='txt' height={100}
                    onBlur={(c) => onBlur(c, keys.sslData, keys.ca)}
                    showLineNumbers={true} showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
            <Field label="Client cert" hidden={protocol !== Protocols.MQTT5} description="The client certificate as PEM-encoded DER">
                <CodeEditor value={sslData.cert} language='txt' height={100}
                    onBlur={(c) => onBlur(c, keys.sslData, keys.cert)}
                    showLineNumbers={true} showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
            <Field label="Client key" hidden={protocol !== Protocols.MQTT5} description="The client private key for Ditto as PEM-encoded PKCS8 specified by RFC-7468; the PEM preamble must be -----BEGIN PRIVATE KEY-----">
                <CodeEditor value={sslData.key} language='txt' height={100}
                    onBlur={(c) => onBlur(c, keys.sslData, keys.key)}
                    showLineNumbers={true} showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
        </div>
    )
}
