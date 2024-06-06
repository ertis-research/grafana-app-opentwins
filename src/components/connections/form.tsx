import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Alert, Button, CodeEditor, Field, Form, FormAPI, InlineLabel, Input, RadioButtonGroup, Switch, useTheme2 } from '@grafana/ui'
import React, { ChangeEvent, Fragment, useEffect, useState, MouseEvent, FormEvent, useContext } from 'react'
import { createConnectionWithoutIdService } from 'services/connections/createConnectionWithoutIdService'
import { enumToISelectList } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import { ConnectionData, DataSource, DataTarget, KafkaData, PayloadMapping } from 'utils/interfaces/connections'
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

    const keys = {
        sources: 'sources',
        targets: 'targets',
        payloadMapping: 'payloadMapping'
    }

    const InvalidMsg = "Blank spaces and uppercase letters are not allowed"
    const initMapper = "function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {\r\n\tconst jsonData = JSON.parse(textPayload);\r\n\tconst namespace = 'test'\r\n\tconst name = jsonData[0];\r\n\tconst value = jsonData[1];\r\n\theaders = Object.assign(headers, { 'Content-Type': 'application/merge-patch+json' });\r\n\r\n\tconst feature = {\r\n\t\thumidity: {\r\n\t\t\tproperties: {\r\n\t\t\t\tvalue: value\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\t\r\n\treturn Ditto.buildDittoProtocolMsg(\r\n\t\tnamespace,\r\n\t\tname,\r\n\t\t'things',\r\n\t\t'twin',\r\n\t\t'commands',\r\n\t\t'merge',\r\n\t\t'/features',\r\n\t\theaders,\r\n\t\tfeature\r\n\t);\r\n}"
    const requirementsMapper = "The mapping function must always have the name mapToDittoProtocolMsg and the specified parameters. In addition, it must return an object or a list of objects built with Ditto.buildDittoProtocolMsg. It uses the Rhino JavaScript engine, double quotes are not allowed and semicolons are mandatory."
    const descriptionExample = "The code shown is an example for a mapper that updates the “humidity” feature for digital twins of the namespace 'test'. For example, a message ['twin', 2] would update the “humidity” feature of the digital twin test:twin to 2."

    const initJSmapping: PayloadMapping = { id: "", code: initMapper }
    const initSource: DataSource = { addresses: '', authorizationContext: 'nginx:ditto', qos: 2, others: {} }
    const initTarget: DataTarget = { address: '', topics: "_/_/things/twin/events,_/_/things/live/messages", authorizationContext: 'nginx:ditto', qos: 2, others: {} }
    const initKafkaData: KafkaData = {bootstrapServers: '', saslMechanism: 'plain'}

    //const context = useContext(StaticContext)

    const ProtocolOptions = enumToISelectList(Protocols) as Array<{ label: string, value: Protocols }>

    //const appEvents = getAppEvents()

    const [currentConnection, setCurrentConnection] = useState<ConnectionData>({ id: '', uri: 'tcp://', initStatus: true, payloadMapping: [], sources: [], targets: [], kafkaData: initKafkaData })
    const [selectedProtocol, setSelectedProtocol] = useState<SelectableValue<Protocols>>(ProtocolOptions[0])
    const [jsonOtherConnection, setJsonOtherConnection] = useState<any>(defaultOtherConnection)


    const isInvalid = (value: string) => {
        return value.includes(" ") || value.toLowerCase() !== value
    }

    const handleOnSubmitFinal = () => {
        /*let connection = {}
        
        switch(selectedProtocol.value){
            case Protocols.KAFKA:
                connection = {}
                return
            case Protocols.MQTT5:
                connection = {}
                return
            default:
                connection = {...otherConnection}
        }
        */
       console.log('jsonothers', jsonOtherConnection)
        createConnectionWithoutIdService(context, jsonOtherConnection).then(() => {
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: ["Conectao"]
            });
        }).catch(() => {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Algo ha fallao ninio"]
            });
        })

    }

    const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentConnection({
            ...currentConnection,
            [event.currentTarget.name]: event.target.value
        })
    }

    const handleOnChangeInputList = (event: FormEvent<HTMLInputElement>, key: string, idx: number) => {
        let newList = [...currentConnection[key as keyof ConnectionData] as any[]]
        newList[idx][event.currentTarget.name] = (event.currentTarget.value).split(",")
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

    const handleOnBlurCodeEditor = (c: string, idx: number) => {
        let newPayloadMapping = [...currentConnection.payloadMapping]
        newPayloadMapping[idx].code = c
        setCurrentConnection({ ...currentConnection, payloadMapping: newPayloadMapping })
        console.log(currentConnection)
    }

    const handleOnChangeSwitchOpen = (e: MouseEvent<HTMLInputElement>) => {
        const checked = (e.target as HTMLInputElement).checked
        setCurrentConnection({
            ...currentConnection,
            initStatus: checked
        })
    }

    useEffect(() => {
    }, [currentConnection])

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
        return <Fragment>
            <Field label="ID" required={true} description="A unique identifier for the payload mapping" invalid={isInvalid(currentConnection.id)} error={isInvalid(currentConnection.id) ? InvalidMsg : ''}>
                <Input id='id' required={true} type="text" value={pm.id} />
            </Field>
            <Field label="JavaScript code" description="JavaScript function that will process messages received by the connection to update at least one digital twin." style={{ marginTop: '10px' }}>
                <CodeEditor value={pm.code} language='javascript' height={600}
                    onBlur={(c) => handleOnBlurCodeEditor(c, idx)}
                    showLineNumbers={true}
                    showMiniMap={false}
                    monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='destructive' icon='trash-alt' onClick={() => handleOnClickRemove(keys.payloadMapping, idx)}>Delete</Button>
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

    const sourcesSection = currentConnection.sources.map((s: DataSource, idx: number) => {
        return <Fragment>
            <Field label="Adresses" required={true} description="A unique identifier for the connection">
                <Input id='addresses' required={true} type="text" value={s.addresses.toLocaleString()} onChange={(e) => handleOnChangeInputList(e, keys.sources, idx)} />
            </Field>
            <Field label="Authorization context" required={true} description="A unique identifier for the connection">
                <Input id='authorizationContext' required={true} type="text" value={s.authorizationContext.toLocaleString()} onChange={(e) => handleOnChangeInputList(e, keys.sources, idx)} />
            </Field>
            <Field label="QoS" required={true} description="A unique identifier for the connection">
                <Input id='qos' required={true} type="number" value={s.qos}/>
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='destructive' icon='trash-alt' onClick={() => handleOnClickRemove(keys.sources, idx)}>Delete</Button>
            </div>
        </Fragment>
    })

    const specificKafka = (selectedProtocol.value === Protocols.KAFKA) ? <div>
        <Field label="Bootstraps servers" required={true} description="A unique identifier for the connection" invalid={isInvalid(currentConnection.id)} error={isInvalid(currentConnection.id) ? InvalidMsg : ''}>
            <Input id='bootstrapServers' required={true} type="text" value={currentConnection.kafkaData?.bootstrapServers} onChange={handleOnChangeInput} />
        </Field>
        <Field label="SASL mechanism" required={true} description="A unique identifier for the connection" invalid={isInvalid(currentConnection.id)} error={isInvalid(currentConnection.id) ? InvalidMsg : ''}>
            <Input id='saslMechanism' required={true} type="text" value={currentConnection.kafkaData?.saslMechanism} onChange={handleOnChangeInput} />
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
                        <Switch value={currentConnection.initStatus} onClick={(e) => handleOnChangeSwitchOpen(e)} />
                    </div>
                </Field>

                <Field label="URI" required={true} description="A unique identifier for the agent">
                    <Input {...register("uri", { required: true })} id='uri' required={true} type="text" value={currentConnection.uri} onChange={handleOnChangeInput} />
                </Field>

                {specificKafka}
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
