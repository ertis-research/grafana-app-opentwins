// src/components/ConnectionForm/components/FormSections/MappersSection.tsx
import React, { Fragment, FormEvent } from 'react'
import { Alert, Button, CodeEditor, Field, Input } from '@grafana/ui'
import { PayloadMapping, SourceData, TargetData } from 'utils/interfaces/connections'
import { descriptionExample, InvalidMsg, keys, requirementsMapper } from '../utils/constants'

interface Props {
    payloadMapping: PayloadMapping[]
    sources: SourceData[]
    targets: TargetData[]
    onChange: (event: FormEvent<HTMLInputElement>, key: string, idx: number) => void
    onBlur: (c: string, idx: number) => void
    onRemove: (key: string, idx: number) => void
}

const isInvalid = (value: string) => {
    return value.includes(" ") || value.toLowerCase() !== value
}

export const MappersSection: React.FC<Props> = ({ payloadMapping, sources, targets, onChange, onBlur, onRemove }) => {
    if (payloadMapping.length === 0) {
        return <div></div>
    }

    const quickFormat = (code: string) => {
        if (!code || code.includes('\n')) { return code || '' };

        let depth = 0;
        return code.replace(/[{};]/g, (char) => {
            if (char === '{') { return `{\n${'\t'.repeat(++depth)}` };
            if (char === '}') { return `\n${'\t'.repeat(Math.max(0, --depth))}}` };
            return `;\n${'\t'.repeat(depth)}`; // Para el punto y coma
        });
    };

    return (
        <Fragment>
            <Alert title='Warning' severity='warning' style={{ marginTop: '20px' }}>
                <div>{requirementsMapper}</div>
            </Alert>
            <Alert title='Info' severity='info'>
                <div>{descriptionExample}</div>
            </Alert>
            {payloadMapping.map((pm: PayloadMapping, idx: number) => {
                const disabled = sources.some((s: SourceData) => s.payloadMapping?.value === pm.id) ||
                    targets.some((s: TargetData) => s.payloadMapping?.value === pm.id)
                return (
                    <Fragment key={idx}>
                        <Field label="ID" required={true} description="A unique identifier for the payload mapping"
                            invalid={isInvalid(pm.id)} error={isInvalid(pm.id) ? InvalidMsg : ''} disabled={disabled}>
                            <Input id='id' name="id" required={true} type="text" value={pm.id}
                                onChange={(e) => onChange(e, keys.payloadMapping, idx)} disabled={disabled} />
                        </Field>
                        <Field label="JavaScript code" description="JavaScript function that will process messages received by the connection to update at least one digital twin." style={{ marginTop: '10px' }}>
                            <CodeEditor value={quickFormat(pm.code)} language='javascript' height={600}
                                onBlur={(c) => onBlur(c, idx)}
                                showLineNumbers={true} showMiniMap={false}
                                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                                onEditorDidMount={(editor, monaco) => {
                                    editor.getAction('editor.action.formatDocument').run();
                                }}
                            />
                        </Field>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant='destructive' disabled={disabled} icon='trash-alt'
                                onClick={() => onRemove(keys.payloadMapping, idx)}>Delete</Button>
                        </div>
                    </Fragment>
                )
            })}
        </Fragment>
    )
}
