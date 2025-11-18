// src/components/ConnectionForm/components/FormSections/TargetsSection.tsx
import React, { Fragment, FormEvent } from 'react'
import { Alert, Button, CodeEditor, Field, Input, Select } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { TargetData } from 'utils/interfaces/connections'
import { Protocols } from '../ConnectionForm.types'
import { SelectData } from 'utils/interfaces/select'
import { keys, rememberPayload } from '../utils/constants'

interface Props {
    targets: TargetData[]
    protocol: Protocols
    qosOptions: SelectData[]
    pmOptions: SelectData[]
    onInputChange: (event: FormEvent<HTMLInputElement>, key: string, idx: number) => void
    onSelectChange: (e: SelectableValue<any>, key: string, name: string, idx: number) => void
    onBlurOthers: (c: string, idx: number, key: string) => void
    onRemove: (key: string, idx: number) => void
}

export const TargetsSection: React.FC<Props> = ({ targets, protocol, qosOptions, pmOptions, onInputChange, onSelectChange, onBlurOthers, onRemove }) => {
    return (
        <Fragment>
            {targets.map((s: TargetData, idx: number) => (
                <Fragment key={idx}>
                    <Field label="Address" required={true} description="Topic to publish events and messages to">
                        <Input name='address' required={true} type="text" value={s.address} onChange={(e) => onInputChange(e, keys.targets, idx)} />
                    </Field>
                    <Field label="Topics" required={true} description="List of strings, each list entry representing a subscription of Ditto protocol topics">
                        <Input name='topics' required={true} type="text" value={s.topics} onChange={(e) => onInputChange(e, keys.targets, idx)} />
                    </Field>
                    <Field label="Authorization context" required={true} description="An authorizationContext needs to be a subject known to Ditto’s authentication. If more than one, separate them with commas.">
                        <Input name='authorizationContext' required={true} type="text" value={s.authorizationContext} onChange={(e) => onInputChange(e, keys.targets, idx)} />
                    </Field>
                    <Field label="QoS" hidden={protocol !== Protocols.MQTT5} required={protocol === Protocols.MQTT5} description="Messages are consumed more or less strictly depending on the configured qos (Quality of Service) value of the source">
                        <Select options={qosOptions} value={s.qos} onChange={(e) => onSelectChange(e, keys.targets, keys.qos, idx)} />
                    </Field>
                    <Alert title='Warning' severity='warning' style={{ marginTop: '20px' }}>
                        <div>{rememberPayload}</div>
                    </Alert>
                    <Field label="Payload mapping" description="Mapper that will process the messages. Default is Ditto protocol.">
                        <Select options={pmOptions} value={s.payloadMapping} onChange={(e) => onSelectChange(e, keys.targets, keys.payloadMapping, idx)} />
                    </Field>
                    <Field label="Other configurations" description="Add any other Eclipse Ditto settings you need in this section. This will be mixed in with the rest of the data.">
                        <CodeEditor value={s.others} language='json' height={100}
                            onBlur={(c) => onBlurOthers(c, idx, keys.targets)}
                            showLineNumbers={true} showMiniMap={false}
                            monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                        />
                    </Field>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant='destructive' icon='trash-alt' onClick={() => onRemove(keys.targets, idx)}>Delete</Button>
                    </div>
                </Fragment>
            ))}
        </Fragment>
    )
}
