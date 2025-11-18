// src/components/ConnectionForm/components/MqttOrKafkaForm.tsx
import React, { MouseEvent } from 'react'
import { Field, Input, Switch, InlineLabel, Button, useTheme2 } from '@grafana/ui'
import { MappersSection } from './FormSections/MappersSection'
import { SourcesSection } from './FormSections/SourcesSection'
import { TargetsSection } from './FormSections/TargetsSection'
import { SpecificKafka } from './FormSections/SpecificKafka'
import { SslSection } from './FormSections/SslSection'
import { ConnectionData } from 'utils/interfaces/connections'
import { Protocols } from './ConnectionForm.types'
import { initMapping, InvalidMsg, keys } from './utils/constants'

interface Props {
    connectionData: ConnectionData
    handlers: any // Tipo del valor de retorno de `useConnectionForm['handlers']`
    protocol: Protocols
    isEditMode: boolean
}

const isInvalid = (value: string) => {
    return value.includes(" ") || value.toLowerCase() !== value
}

export const MqttOrKafkaForm: React.FC<Props> = ({ connectionData, handlers, protocol, isEditMode }) => {
    const bgcolor = useTheme2().colors.background.secondary

    // --- Lógica de opciones de Select ---
    // Estas funciones ahora viven aquí, ya que dependen del estado
    const getPMOptions = () => {
        return [initMapping].concat(connectionData.payloadMapping.map((pm: any) => {
            return { label: pm.id, value: pm.id }
        }))
    }

    const getQoSOptions = () => {
        return Array.from({ length: (protocol === Protocols.MQTT5) ? 3 : 2 }, (_, i) => {
            return { value: i, label: i.toLocaleString() }
        });
    }

    const pmOptions = getPMOptions()
    const qosOptions = getQoSOptions()

    return (
        <div style={{ minHeight: '100%' }}>
            {/* --- SECCIÓN: GENERAL --- */}
            <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
                <h4> General information </h4>
                <hr />
                <Field label="Identifier" required={true} description="A unique identifier for the connection"
                    invalid={isInvalid(connectionData.id)} error={isInvalid(connectionData.id) ? InvalidMsg : ''}>
                    <Input
                        id='id'
                        name="id"
                        required={true}
                        value={connectionData.id}
                        onChange={handlers.handleOnChangeInput}
                        disabled={isEditMode} // No se puede editar el ID
                    />
                </Field>

                <Field label="Status" description="Initial connection status">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel width={5.1}>{(connectionData.initStatus) ? 'Open' : 'Close'}</InlineLabel>
                        <Switch value={connectionData.initStatus} name='initStatus' onClick={(e: MouseEvent<HTMLInputElement>) => handlers.handleOnChangeSwitch(e, keys.initStatus)} />
                    </div>
                </Field>

                <Field label="URI" required={true} description="URI of the messaging broker">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel width={4}>{(connectionData.ssl) ? 'ssl://' : 'tcp://'}</InlineLabel>
                        <Input id='uri' name="uri" required={true} type="text" value={connectionData.uri} onChange={handlers.handleOnChangeInput} />
                    </div>
                </Field>

                {protocol === Protocols.KAFKA && (
                    <SpecificKafka
                        kafkaData={connectionData.kafkaData}
                        onInputChange={handlers.handleOnChangeInputSecondLevel}
                        onSelectChange={handlers.handleOnChangeSelectSecondLevel}
                    />
                )}

                <Field label="SSL" description="SSL required or not">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel width={7}>{(connectionData.ssl) ? 'Enabled' : 'Disabled'}</InlineLabel>
                        <Switch value={connectionData.ssl} onClick={(e: MouseEvent<HTMLInputElement>) => handlers.handleOnChangeSwitch(e, keys.ssl)} />
                    </div>
                </Field>

                {connectionData.ssl && (
                    <SslSection
                        sslData={connectionData.sslData}
                        protocol={protocol}
                        onBlur={handlers.handleOnBlurCodeEditorSecondLevel}
                    />
                )}
            </div>

            {/* --- SECCIÓN: MAPPERS --- */}
            <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
                <h4>Message mapping</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='secondary' onClick={handlers.handleAddMapper}>Add JavaScript mapping</Button>
                </div>
                <MappersSection
                    payloadMapping={connectionData.payloadMapping}
                    sources={connectionData.sources}
                    targets={connectionData.targets}
                    onChange={handlers.handleOnChangeInputInList}
                    onBlur={handlers.handleOnBlurCodeEditorPM}
                    onRemove={handlers.handleOnClickRemove}
                />
            </div>

            {/* --- SECCIÓN: SOURCES --- */}
            <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
                <h4>Sources</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='secondary' onClick={handlers.handleAddSource}>Add source</Button>
                </div>
                <SourcesSection
                    sources={connectionData.sources}
                    qosOptions={qosOptions}
                    pmOptions={pmOptions}
                    onInputChange={handlers.handleOnChangeInputInList}
                    onSelectChange={handlers.handleOnChangeSelectInList}
                    onBlurOthers={handlers.handleOnBlurCodeEditorOthers}
                    onRemove={handlers.handleOnClickRemove}
                />
            </div>

            {/* --- SECCIÓN: TARGETS --- */}
            <div style={{ backgroundColor: bgcolor, padding: '30px' }}>
                <h4>Targets</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='secondary' onClick={handlers.handleAddTarget}>Add target</Button>
                </div>
                <TargetsSection
                    targets={connectionData.targets}
                    protocol={protocol}
                    qosOptions={qosOptions}
                    pmOptions={pmOptions}
                    onInputChange={handlers.handleOnChangeInputInList}
                    onSelectChange={handlers.handleOnChangeSelectInList}
                    onBlurOthers={handlers.handleOnBlurCodeEditorOthers}
                    onRemove={handlers.handleOnClickRemove}
                />
            </div>
        </div>
    )
}
