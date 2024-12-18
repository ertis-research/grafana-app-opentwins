import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Alert, Button, CodeEditor, Field, Form, FormAPI, InlineLabel, Input, RadioButtonGroup, Select, Switch, useTheme2 } from '@grafana/ui'
import React, { ChangeEvent, Fragment, useEffect, useState, MouseEvent, FormEvent, useContext } from 'react'
import { createConnectionWithIdService } from 'services/connections/createConnectionWithIdService'
import { createConnectionWithoutIdService } from 'services/connections/createConnectionWithoutIdService'
import { checkIsEditor } from 'utils/auxFunctions/auth'
import { enumToISelectList } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import { ConnectionData, SourceData, TargetData, KafkaData, PayloadMapping, SSLData } from 'utils/interfaces/connections'
import { SelectData } from 'utils/interfaces/select'
import defaultOtherConnection from '../../utils/default/defaultOtherConnection.json'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

enum Protocols {
    MQTT5 = 'MQTT5',
    KAFKA = 'Kafka',
    OTHERS = 'Others'
}

export function CreateFormConnection({ path, meta }: Parameters) {

    const context = useContext(StaticContext)
    const appEvents = getAppEvents()
    const bgcolor = useTheme2().colors.background.secondary

    const InvalidMsg = "Blank spaces and uppercase letters are not allowed"
    const initMapper = "function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {\r\n\tconst jsonData = JSON.parse(textPayload);\r\n\tconst namespace = 'test';\r\n\tconst name = jsonData.id;\r\n\tconst value = jsonData.value;\r\n\theaders = Object.assign(headers, { 'Content-Type': 'application/merge-patch+json' });\r\n\r\n\tconst feature = {\r\n\t\thumidity: {\r\n\t\t\tproperties: {\r\n\t\t\t\tvalue: value\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\t\r\n\treturn Ditto.buildDittoProtocolMsg(\r\n\t\tnamespace,\r\n\t\tname,\r\n\t\t'things',\r\n\t\t'twin',\r\n\t\t'commands',\r\n\t\t'merge',\r\n\t\t'/features',\r\n\t\theaders,\r\n\t\tfeature\r\n\t);\r\n}"
    const requirementsMapper = "The mapping function must always have the name mapToDittoProtocolMsg and the specified parameters. In addition, it must return an object or a list of objects built with Ditto.buildDittoProtocolMsg. It uses the Rhino JavaScript engine, double quotes are not allowed and semicolons are mandatory."
    const descriptionExample = 'The code shown is an example for a mapper that updates the “humidity” feature for digital twins of the namespace "test". For example, a message { "id": "twin", "value": 5 } would update the “humidity” feature of the digital twin test:twin to 2.'

    const initQoS = { label: '1', value: 1 }
    const initMapping = { label: 'Ditto protocol', value: 'Ditto' }
    const initJSmapping: PayloadMapping = { id: "", code: initMapper }
    const initSource: SourceData = { addresses: '', authorizationContext: 'nginx:ditto', qos: initQoS, payloadMapping: initMapping, others: '' }
    const initTarget: TargetData = { address: '', topics: "_/_/things/twin/events,_/_/things/live/messages", authorizationContext: 'nginx:ditto', qos: initQoS, payloadMapping: initMapping, others: '' }
    const initKafkaData: KafkaData = { bootstrapServers: '', saslMechanism: { label: 'plain', value: 0 } }
    const initSSLData: SSLData = { ca: '', cert: '', key: '' }
    const initConnectionData = { id: '', uri: '', ssl: false, initStatus: true, payloadMapping: [], sources: [], targets: [], kafkaData: initKafkaData, sslData: initSSLData }

    const keys = {
        id: 'id', uri: 'uri', ssl: 'ssl', initStatus: 'initStatus', payloadMapping: 'payloadMapping', sources: 'sources', targets: 'targets',
        kafkaData: 'kafkaData', sslData: 'sslData', others: 'others', qos: 'qos', saslMechanism: 'saslMechanism', ca: 'ca', cert: 'cert', key: 'key'
    }

    const ProtocolOptions = enumToISelectList(Protocols) as Array<{ label: string, value: Protocols }>
    const SSALMechanismOptions: SelectData[] = [{ label: 'plain', value: 0 }, { label: 'scram-sha-256', value: 1 }, { label: 'scram-sha-512', value: 2 }]

    const [currentConnection, setCurrentConnection] = useState<ConnectionData>(initConnectionData)
    const [selectedProtocol, setSelectedProtocol] = useState<SelectableValue<Protocols>>(ProtocolOptions[0])
    const [jsonOtherConnection, setJsonOtherConnection] = useState<any>(defaultOtherConnection)

    const getPMOptions = () => {
        return [initMapping].concat(currentConnection.payloadMapping.map((pm: PayloadMapping) => {
            return { label: pm.id, value: pm.id }
        }))
    }

    const getQoSOptions = () => {
        return Array.from({ length: (selectedProtocol.value === Protocols.MQTT5) ? 3 : 2 }, (_, i) => { return { value: i, label: i.toLocaleString() } });
    }

    const isInvalid = (value: string) => {
        return value.includes(" ") || value.toLowerCase() !== value
    }

    const strToList = (s: string) => {
        return s.split(",").map((s: string) => s.trim())
    }

    const handleOnSubmitFinal = () => {
        if (selectedProtocol.value === Protocols.OTHERS) {
            createConnectionWithoutIdService(context, jsonOtherConnection).then(() => {
                appEvents.publish({
                    type: AppEvents.alertSuccess.name,
                    payload: ["The connection has been created successfully"]
                });
            }).catch((e: Error) => {
                let msg = ""
                try {
                    const response = JSON.parse(e.message)
                    msg = response.message
                } catch (e) { }
                appEvents.publish({
                    type: AppEvents.alertError.name,
                    payload: ["Connection has not been created. " + msg]
                });
            })
        } else {
            let data: any = {
                name: currentConnection.id,
                connectionType: (selectedProtocol.value === Protocols.KAFKA) ? 'kafka' : 'mqtt-5',
                connectionStatus: (currentConnection.initStatus) ? 'open' : 'closed',
                failoverEnabled: true,
                uri: ((currentConnection.ssl) ? 'ssl://' : 'tcp://') + currentConnection.uri,
                sources: [],
                targets: []
            }
            if (selectedProtocol.value === Protocols.KAFKA) {
                data['specificConfig'] = {
                    bootstrapServers: currentConnection.kafkaData.bootstrapServers,
                    saslMechanism: currentConnection.kafkaData.saslMechanism.label
                }
            }
            if (currentConnection.ssl) {
                if (currentConnection.sslData.ca !== undefined && currentConnection.sslData.ca.trim() !== '') {
                    data['validateCertificates'] = true
                    data['ca'] = currentConnection.sslData.ca
                }
                if (currentConnection.sslData.cert && currentConnection.sslData.key) {
                    data['credentials'] = {
                        type: 'client-cert',
                        cert: currentConnection.sslData.cert,
                        key: currentConnection.sslData.key
                    }
                }
            }
            currentConnection.sources.forEach((s: SourceData, idx: number) => {
                data.sources[idx] = {
                    addresses: strToList(s.addresses),
                    authorizationContext: strToList(s.authorizationContext),
                    qos: s.qos.value,
                    payloadMapping: [s.payloadMapping?.value],
                }
                try {
                    data.sources[idx] = {
                        ...data.sources[idx],
                        ...JSON.parse(s.others)
                    }
                } catch (e) { }
            })
            currentConnection.targets.forEach((t: TargetData, idx: number) => {
                data.targets[idx] = {
                    address: t.address,
                    topics: strToList(t.topics),
                    authorizationContext: strToList(t.authorizationContext),
                    payloadMapping: [t.payloadMapping?.value]
                }
                try {
                    data.targets[idx] = {
                        ...data.targets[idx],
                        ...JSON.parse(t.others)
                    }
                } catch (e) { }
                if (selectedProtocol.value === Protocols.MQTT5) {
                    data.targets[idx].qos = t.qos
                }
            })
            if (currentConnection.payloadMapping.length > 0) {
                let pms = {}
                currentConnection.payloadMapping.forEach((pm: PayloadMapping) => {
                    pms = {
                        ...pms,
                        [pm.id]: {
                            mappingEngine: "JavaScript",
                            options: {
                                incomingScript: pm.code.replaceAll("\t", "").replaceAll("\r\n", " ").replaceAll('"', "'")
                            }
                        }
                    }
                })
                data['mappingDefinitions'] = pms
            }
            console.log("Connection", data)
            createConnectionWithIdService(context, currentConnection.id, data).then(() => {
                appEvents.publish({
                    type: AppEvents.alertSuccess.name,
                    payload: ["The connection has been created successfully"]
                });
            }).catch((e: Error) => {
                let msg = ""
                try {
                    const response = JSON.parse(e.message)
                    msg = response.message + ". " + response.description
                } catch (e) { }
                appEvents.publish({
                    type: AppEvents.alertError.name,
                    payload: ["Connection has not been created. " + msg]
                });
            })
        }
    }

    const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentConnection({
            ...currentConnection,
            [event.currentTarget.name]: event.target.value
        })
    }

    const handleOnChangeInputSecondLevel = (event: FormEvent<HTMLInputElement>, key: string) => {
        setCurrentConnection({
            ...currentConnection,
            [key]: {
                ...currentConnection[key as keyof ConnectionData] as any,
                [event.currentTarget.name]: event.currentTarget.value
            }
        })
    }

    const handleOnChangeSelectInList = (e: SelectableValue<any>, key: string, name: string, idx: number) => {
        let newValue = [...currentConnection[key as keyof ConnectionData] as any[]]
        newValue[idx][name] = e
        setCurrentConnection({
            ...currentConnection,
            [key]: newValue
        })
    }

    const handleOnChangeSelectSecondLevel = (e: SelectableValue<any>, key: string, name: string) => {
        setCurrentConnection({
            ...currentConnection,
            [key]: {
                ...currentConnection[key as keyof ConnectionData] as any,
                [name]: e
            }
        })
    }

    const handleOnChangeInputInList = (event: FormEvent<HTMLInputElement>, key: string, idx: number) => {
        let newList = [...currentConnection[key as keyof ConnectionData] as any[]]
        newList[idx][event.currentTarget.name] = event.currentTarget.value
        setCurrentConnection({
            ...currentConnection,
            [key]: newList
        })
    }

    const handleOnClickAdd = (key: string, initObject: any) => {
        setCurrentConnection({
            ...currentConnection,
            [key]: [...(currentConnection[key as keyof ConnectionData] as any[]), initObject]
        })
    }

    const handleOnClickRemove = (key: string, idx: number) => {
        let newList = [...currentConnection[key as keyof ConnectionData] as any[]]
        newList.splice(idx, 1)
        setCurrentConnection({
            ...currentConnection,
            [key]: newList
        })
    }

    const handleOnBlurCodeEditorPM = (c: string, idx: number) => {
        let newPayloadMapping = [...currentConnection.payloadMapping]
        newPayloadMapping[idx].code = c
        setCurrentConnection({ ...currentConnection, payloadMapping: newPayloadMapping })
    }

    const handleOnBlurCodeEditorOthers = (c: string, idx: number, key: string) => {
        let newElement = [...currentConnection[key as keyof ConnectionData] as any]
        newElement[idx][keys.others] = c
        setCurrentConnection({ ...currentConnection, [key]: newElement })
    }

    const handleOnBlurCodeEditorSecondLevel = (c: string, key: string, name: string) => {
        setCurrentConnection({
            ...currentConnection,
            [key]: {
                ...currentConnection[key as keyof ConnectionData] as any,
                [name]: c
            }
        })
    }

    const handleOnChangeSwitch = (e: MouseEvent<HTMLInputElement>, key: string) => {
        const checked = (e.target as HTMLInputElement).checked
        setCurrentConnection({
            ...currentConnection,
            [key]: checked
        })
    }

    useEffect(() => {
    }, [currentConnection])

    useEffect(() => {
        checkIsEditor().then((res) => {
            if (!res) {
                window.location.replace(path)
            }
        })
    }, [])


    useEffect(() => {
        if (selectedProtocol.value === Protocols.KAFKA) {
            currentConnection.sources.forEach((s: SourceData, idx) => {
                if (s.qos.value === 2) {
                    let newList = [...currentConnection.sources]
                    newList[idx].qos = initQoS
                    setCurrentConnection({ ...currentConnection, sources: newList })
                }
            })
            currentConnection.targets.forEach((s: TargetData, idx) => {
                if (s.qos.value === 2) {
                    let newList = [...currentConnection.targets]
                    newList[idx].qos = initQoS
                    setCurrentConnection({ ...currentConnection, targets: newList })
                }
            })
        }
    }, [selectedProtocol])

    const otherConnection = ({ register, errors, control }: FormAPI<any>) => {
        return <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
            <h4> Connection definition </h4>
            <hr />
            <CodeEditor value={JSON.stringify(jsonOtherConnection, null, '\t')} language='json' height={600}
                onBlur={(c) => setJsonOtherConnection(JSON.parse(c))}
                showLineNumbers={true}
                showMiniMap={false}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            />
        </div>
    }

    const jsMappers = currentConnection.payloadMapping.map((pm: PayloadMapping, idx: number) => {
        const disabled = currentConnection.sources.some((s: SourceData) => s.payloadMapping?.value === pm.id) || currentConnection.targets.some((s: TargetData) => s.payloadMapping?.value === pm.id)
        return <Fragment>
            <Field label="ID" required={true} description="A unique identifier for the payload mapping" invalid={isInvalid(currentConnection.id)} error={isInvalid(currentConnection.id) ? InvalidMsg : ''} disabled={disabled}>
                <Input id='id' name="id" required={true} type="text" value={pm.id} onChange={(e) => handleOnChangeInputInList(e, keys.payloadMapping, idx)} disabled={disabled} />
            </Field>
            <Field label="JavaScript code" description="JavaScript function that will process messages received by the connection to update at least one digital twin." style={{ marginTop: '10px' }}>
                <CodeEditor value={pm.code} language='javascript' height={600}
                    onBlur={(c) => handleOnBlurCodeEditorPM(c, idx)}
                    showLineNumbers={true}
                    showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='destructive' disabled={disabled} icon='trash-alt' onClick={() => handleOnClickRemove(keys.payloadMapping, idx)}>Delete</Button>
            </div>
        </Fragment>
    })

    const mappersSection = (currentConnection.payloadMapping.length > 0) ? <Fragment>
        <Alert title='Warning' severity='warning' style={{ marginTop: '20px' }}>
            <div>{requirementsMapper}</div>
        </Alert>
        <Alert title='Info' severity='info'>
            <div>{descriptionExample}</div>
        </Alert>
        {jsMappers}
    </Fragment> : <div></div>

    const sourcesSection = currentConnection.sources.map((s: SourceData, idx: number) => {
        return <Fragment>
            <Field label="Adresses" required={true} description="Topics to subscribe to. If more than one, separate them with commas.">
                <Input name='addresses' required={true} type="text" value={s.addresses} onChange={(e) => handleOnChangeInputInList(e, keys.sources, idx)} />
            </Field>
            <Field label="Authorization context" required={true} description="An authorizationContext needs to be a subject known to Ditto’s authentication. If more than one, separate them with commas.">
                <Input name='authorizationContext' required={true} type="text" value={s.authorizationContext} onChange={(e) => handleOnChangeInputInList(e, keys.sources, idx)} />
            </Field>
            <Field label="QoS" required={true} description="Messages are consumed more or less strictly depending on the configured qos (Quality of Service) value of the source">
                <Select options={getQoSOptions()} value={s.qos} onChange={(e) => handleOnChangeSelectInList(e, keys.sources, keys.qos, idx)} />
            </Field>
            <Field label="Payload mapping" description="Mapper that will process the messages. Default is Ditto protocol.">
                <Select options={getPMOptions()} value={s.payloadMapping} onChange={(e) => handleOnChangeSelectInList(e, keys.sources, keys.payloadMapping, idx)} />
            </Field>
            <Field label="Other configurations" description="Add any other Eclipse Ditto settings you need in this section. This will be mixed in with the rest of the data.">
                <CodeEditor value={s.others} language='json' height={100}
                    onBlur={(c) => handleOnBlurCodeEditorOthers(c, idx, keys.sources)}
                    showLineNumbers={true}
                    showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='destructive' icon='trash-alt' onClick={() => handleOnClickRemove(keys.sources, idx)}>Delete</Button>
            </div>
        </Fragment>
    })


    const targetsSection = currentConnection.targets.map((s: TargetData, idx: number) => {
        return <Fragment>
            <Field label="Address" required={true} description="Topic to publish events and messages to">
                <Input name='address' required={true} type="text" value={s.address} onChange={(e) => handleOnChangeInputInList(e, keys.targets, idx)} />
            </Field>
            <Field label="Topics" required={true} description="List of strings, each list entry representing a subscription of Ditto protocol topics">
                <Input name='topics' required={true} type="text" value={s.topics} onChange={(e) => handleOnChangeInputInList(e, keys.targets, idx)} />
            </Field>
            <Field label="Authorization context" required={true} description="An authorizationContext needs to be a subject known to Ditto’s authentication. If more than one, separate them with commas.">
                <Input name='authorizationContext' required={true} type="text" value={s.authorizationContext} onChange={(e) => handleOnChangeInputInList(e, keys.targets, idx)} />
            </Field>
            <Field label="QoS" hidden={selectedProtocol.value !== Protocols.MQTT5} required={selectedProtocol.value === Protocols.MQTT5} description="Messages are consumed more or less strictly depending on the configured qos (Quality of Service) value of the source">
                <Select options={getQoSOptions()} value={s.qos} onChange={(e) => handleOnChangeSelectInList(e, keys.targets, keys.qos, idx)} />
            </Field>
            <Field label="Payload mapping" description="Mapper that will process the messages. Default is Ditto protocol.">
                <Select options={getPMOptions()} value={s.payloadMapping} onChange={(e) => handleOnChangeSelectInList(e, keys.targets, keys.payloadMapping, idx)} />
            </Field>
            <Field label="Other configurations" description="Add any other Eclipse Ditto settings you need in this section. This will be mixed in with the rest of the data.">
                <CodeEditor value={s.others} language='json' height={100}
                    onBlur={(c) => handleOnBlurCodeEditorOthers(c, idx, keys.targets)}
                    showLineNumbers={true}
                    showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='destructive' icon='trash-alt' onClick={() => handleOnClickRemove(keys.targets, idx)}>Delete</Button>
            </div>
        </Fragment>
    })

    const specificKafka = (selectedProtocol.value === Protocols.KAFKA) ? <div>
        <Field label="Bootstraps servers" required={true} description="Contains a comma separated list of Kafka bootstrap servers to use for connecting to (in addition to the still required connection uri)">
            <Input name='bootstrapServers' required={true} type="text" value={currentConnection.kafkaData.bootstrapServers} onChange={(e) => handleOnChangeInputSecondLevel(e, keys.kafkaData)} />
        </Field>
        <Field label="SASL mechanism" required={true} description="Required if connection uri contains username/password. Choose one of the following SASL mechanisms to use for authentication at Kafka">
            <Select options={SSALMechanismOptions} value={currentConnection.kafkaData.saslMechanism} onChange={(e) => handleOnChangeSelectSecondLevel(e, keys.kafkaData, keys.saslMechanism)} />
        </Field>
    </div> : <div></div>

    const sslSection = (currentConnection.ssl) ? <div>
        <Field label="CA" description="A string of trusted certificates as PEM-encoded DER. Concatenate multiple certificates as strings to trust all of them. Omit to trust popular certificate authorities.">
            <CodeEditor value={currentConnection.sslData.ca} language='txt' height={100}
                onBlur={(c) => handleOnBlurCodeEditorSecondLevel(c, keys.sslData, keys.ca)}
                showLineNumbers={true}
                showMiniMap={false}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            />
        </Field>
        <Field label="Client cert" hidden={selectedProtocol.value !== Protocols.MQTT5} description="The client certificate as PEM-encoded DER">
            <CodeEditor value={currentConnection.sslData.cert} language='txt' height={100}
                onBlur={(c) => handleOnBlurCodeEditorSecondLevel(c, keys.sslData, keys.cert)}
                showLineNumbers={true}
                showMiniMap={false}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            />
        </Field>
        <Field label="Client key" hidden={selectedProtocol.value !== Protocols.MQTT5} description="The client private key for Ditto as PEM-encoded PKCS8 specified by RFC-7468; the PEM preamble must be -----BEGIN PRIVATE KEY-----">
            <CodeEditor value={currentConnection.sslData.key} language='txt' height={100}
                onBlur={(c) => handleOnBlurCodeEditorSecondLevel(c, keys.sslData, keys.key)}
                showLineNumbers={true}
                showMiniMap={false}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            />
        </Field>
    </div> : <div></div>

    const mqttOrKafkaForm = ({ register, errors, control }: FormAPI<any>) => {
        return <div style={{ minHeight: '100%' }}>
            <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
                <h4> General information </h4>
                <hr />
                <Field label="Identifier" required={true} description="A unique identifier for the connection" invalid={isInvalid(currentConnection.id)} error={isInvalid(currentConnection.id) ? InvalidMsg : ''}>
                    <Input {...register("id", { required: true })} id='id' required={true} type="text" value={currentConnection.id} onChange={handleOnChangeInput} />
                </Field>

                <Field label="Status" description="Initial connection status">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel style={{ marginLeft: '0px', paddingLeft: '0px' }} width={5.1}>{(currentConnection.initStatus) ? 'Open' : 'Close'}</InlineLabel>
                        <Switch value={currentConnection.initStatus} name='initStatus' onClick={(e) => handleOnChangeSwitch(e, keys.initStatus)} />
                    </div>
                </Field>

                <Field label="URI" required={true} description="URI of the messaging broker">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel style={{ marginLeft: '0px', paddingLeft: '0px' }} width={4}>{(currentConnection.ssl) ? 'ssl://' : 'tcp://'}</InlineLabel>
                        <Input {...register("uri", { required: true })} id='uri' required={true} type="text" value={currentConnection.uri} onChange={handleOnChangeInput} />
                    </div>
                </Field>

                {specificKafka}

                <Field label="SSL" description="SSL required or not">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InlineLabel style={{ marginLeft: '0px', paddingLeft: '0px' }} width={7}>{(currentConnection.ssl) ? 'Enabled' : 'Disabled'}</InlineLabel>
                        <Switch value={currentConnection.ssl} onClick={(e) => handleOnChangeSwitch(e, keys.ssl)} />
                    </div>
                </Field>

                {sslSection}
            </div>

            <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
                <h4>Message mapping</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='secondary' onClick={() => handleOnClickAdd(keys.payloadMapping, initJSmapping)}>Add JavaScript mapping</Button>
                </div>
                {mappersSection}
            </div>

            <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
                <h4>Sources</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='secondary' onClick={() => handleOnClickAdd(keys.sources, initSource)}>Add source</Button>
                </div>
                {sourcesSection}
            </div>

            <div style={{ backgroundColor: bgcolor, padding: '30px' }}>
                <h4>Targets</h4>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='secondary' onClick={() => handleOnClickAdd(keys.targets, initTarget)}>Add target</Button>
                </div>
                {targetsSection}
            </div>
        </div>
    }

    const formByProtocol = () => {
        switch (selectedProtocol.value) {
            case Protocols.KAFKA:
                return mqttOrKafkaForm
            case Protocols.MQTT5:
                return mqttOrKafkaForm
            default:
                return otherConnection
        }
    }

    return <Fragment>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>New connection</h2>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <RadioButtonGroup options={ProtocolOptions} value={selectedProtocol.value} onChange={(v) => setSelectedProtocol({ label: v, value: v })} />
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                {formByProtocol()}
            </Form>
            <Button style={{ marginTop: '10px' }} variant="primary" type="submit" form="finalForm">Create connection</Button>
        </div>
    </Fragment>
}
