import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { Button, Field, Form, FormAPI, Input, RadioButtonGroup, TextArea } from '@grafana/ui'
import React, { ChangeEvent, Fragment, useState } from 'react'
import { enumToISelectList } from 'utils/auxFunctions/general'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

interface ConnectionData {
    id: string,
    name: string,
    data: string
}

enum Protocols {
    MQTT = 'MQTT',
    KAFKA = 'Kafka',
    OTHER = 'Other'
}

export function CreateFormConnection({ path, meta }: Parameters) {

    const InvalidMsg = "Blank spaces and uppercase letters are not allowed"
    
    //const context = useContext(StaticContext)

    const ProtocolOptions = enumToISelectList(Protocols) as Array<{label: string, value: Protocols}>

    //const appEvents = getAppEvents()

    const [currentConnection, setCurrentConnection] = useState<ConnectionData>({ id: '', data: '', name: '' })
    const [selectedProtocol, setSelectedProtocol] = useState<SelectableValue<Protocols>>(ProtocolOptions[0])

    const isInvalid = (value: string) => {
        return value.includes(" ") || value.toLowerCase() !== value
    }

    const handleOnSubmitFinal = () => {
        
    }

    const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentConnection({
            ...currentConnection,
            [event.currentTarget.name]: event.target.value
        })
    }

    const handleOnChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentConnection({
            ...currentConnection,
            [event.currentTarget.name]: event.target.value
        })
    }

    return <Fragment>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                {({ register, errors, control }: FormAPI<ConnectionData>) => {
                    return (
                        <div style={{ minHeight: '100%' }}>
                            <h2 style={{ marginBottom: '20px' }}>Create new connection</h2>

                            <Field style={{ marginBottom: '5px' }} label="Message protocol" description="Message protocol for connection" required={true}>
                                <RadioButtonGroup options={ProtocolOptions} value={selectedProtocol.value} onChange={(v) => setSelectedProtocol({ label: v, value: v })}/>
                            </Field>

                            <Field label="Identifier" required={true} description="A unique identifier for the agent" invalid={isInvalid(currentConnection.id)} error={isInvalid(currentConnection.id) ? InvalidMsg : ''}>
                                <Input {...register("id", { required: true })} type="text" value={currentConnection.id} onChange={handleOnChangeInput} />
                            </Field>

                            <Field label="Name" description="A readable name for the agent that does not need to be unique" required={true} invalid={currentConnection.name.includes(" ")} error={currentConnection.name.includes(" ") ? 'Blank spaces are not allowed' : ''}>
                                <Input {...register("name", { required: true })} type="text" value={currentConnection.name} onChange={handleOnChangeInput} />
                            </Field>

                            <TextArea style={{ resize: 'none', minHeight: '500px', flex: 1, overflow: "auto", boxSizing: 'border-box' }} {...register("data", { required: true })} cols={25} type="text" value={currentConnection.data} onChange={handleOnChangeTextArea} />

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                                <Button variant="primary" type="submit" form="finalForm">Create connection</Button>
                            </div>
                        </div>
                    )
                }}
            </Form>
        </div>
    </Fragment>
}
