// src/components/ConnectionForm/components/MqttOrKafkaForm.tsx
import React, { MouseEvent } from 'react'
import { Field, Input, Switch, InlineLabel, Button } from '@grafana/ui'
import { MappersSection } from './subcomponents/MappersSection'
import { SourcesSection } from './subcomponents/SourcesSection'
import { TargetsSection } from './subcomponents/TargetsSection'
import { SpecificKafka } from './subcomponents/SpecificKafka'
import { SslSection } from './subcomponents/SslSection'
import { ConnectionData } from 'utils/interfaces/connections'
import { Protocols } from './ConnectionForm.types'
import { initMapping, InvalidMsg, keys } from './utils/constants'

interface Props {
    connectionData: ConnectionData
    handlers: any 
    protocol: Protocols
    isEditMode: boolean
}

const isInvalid = (value: string) => {
    return value.includes(" ") || value.toLowerCase() !== value
}

export const MqttOrKafkaForm: React.FC<Props> = ({ connectionData, handlers, protocol, isEditMode }) => {

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
        <div style={{ minHeight: '100%', width: '100%' }}>
            
            {/* --- SECCIÓN: GENERAL --- */}
            {/* 2. LIMPIEZA: Quitamos backgroundColor y padding. Solo margin abajo. */}
            <div style={{ marginBottom: '40px' }}>
                <h4> General information </h4>
                <hr style={{ marginBottom: '20px' }} />
                
                <Field label="Identifier" required={true} description="A unique identifier for the connection"
                    invalid={isInvalid(connectionData.id)} error={isInvalid(connectionData.id) ? InvalidMsg : ''}>
                    <Input
                        id='id'
                        name="id"
                        required={true}
                        value={connectionData.id}
                        onChange={handlers.handleOnChangeInput}
                        disabled={isEditMode} 
                    />
                </Field>

                <Field label="Status" description="Initial connection status">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel width={5.1} transparent style={{ marginRight: '10px'}}>{(connectionData.initStatus) ? 'Open' : 'Close'}</InlineLabel>
                        <Switch value={connectionData.initStatus} name='initStatus' onClick={(e: MouseEvent<HTMLInputElement>) => handlers.handleOnChangeSwitch(e, keys.initStatus)} />
                    </div>
                </Field>

                <Field label="Host URI" required={true} description="Host address and port of the broker">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel transparent width={4} style={{ marginRight: '10px'}}>{(connectionData.ssl) ? 'ssl://' : 'tcp://'}</InlineLabel>
                        <Input 
                            id='uri' 
                            name="uri" 
                            required={true} 
                            type="text" 
                            value={connectionData.uri} 
                            onChange={handlers.handleOnChangeInput} 
                        />
                    </div>
                </Field>

                <Field label="Authentication" description="Enable username and password authentication">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel transparent width={7} style={{ marginRight: '10px'}}>{(connectionData.hasAuth) ? 'Enabled' : 'Disabled'}</InlineLabel>
                        <Switch 
                            value={connectionData.hasAuth} 
                            onClick={(e: MouseEvent<HTMLInputElement>) => handlers.handleOnChangeSwitch(e, 'hasAuth')} 
                        />
                    </div>
                </Field>

                {connectionData.hasAuth && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <Field label="Username" style={{ flex: 1 }}>
                            <Input 
                                id='username' 
                                name="username" 
                                value={connectionData.username || ''} 
                                onChange={handlers.handleOnChangeInput}
                            />
                        </Field>
                        <Field label="Password" style={{ flex: 1 }}>
                            <Input 
                                id='password' 
                                name="password" 
                                type="password" 
                                value={connectionData.password || ''} 
                                onChange={handlers.handleOnChangeInput} 
                            />
                        </Field>
                    </div>
                )}

                {protocol === Protocols.KAFKA && (
                    <SpecificKafka
                        kafkaData={connectionData.kafkaData}
                        onInputChange={handlers.handleOnChangeInputSecondLevel}
                        onSelectChange={handlers.handleOnChangeSelectSecondLevel}
                    />
                )}

                <Field label="SSL" description="SSL required or not">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel transparent width={7} style={{ marginRight: '10px'}}>{(connectionData.ssl) ? 'Enabled' : 'Disabled'}</InlineLabel>
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
            <div style={{ marginBottom: '40px' }}>
                <h4>Message mapping</h4>
                <hr style={{ marginBottom: '20px' }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
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
            <div style={{ marginBottom: '40px' }}>
                <h4>Sources</h4>
                <hr style={{ marginBottom: '20px' }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
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
            <div style={{ marginBottom: '10px' }}>
                <h4>Targets</h4>
                <hr style={{ marginBottom: '20px' }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
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
