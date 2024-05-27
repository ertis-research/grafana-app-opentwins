import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { Button, Field, Form, FormAPI, Input, RadioButtonGroup, TextArea } from '@grafana/ui'
import React, { ChangeEvent, Fragment, useContext, useState } from 'react'
import { createAgentService } from 'services/agents/createAgentService'
import { setNestedKey } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import yaml from 'js-yaml'
import { getAppEvents } from '@grafana/runtime'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

interface FormData {
    id: string,
    namespace: string,
    data: string,
    name: string
}

enum Formats {
    json = 'JSON',
    yaml = 'YAML'
}

const FormatsOptions = [
    { label: Formats.json, value: Formats.json },
    { label: Formats.yaml, value: Formats.yaml }
]

export function CreateFormAgent({ path, meta }: Parameters) {

    const InvalidMsg = "Blank spaces and uppercase letters are not allowed"
    
    const context = useContext(StaticContext)

    const appEvents = getAppEvents()

    const [currentAgent, setCurrentAgent] = useState<FormData>({ id: '', namespace: '', data: '', name: '' })
    const [selectedFormat, setSelectedFormat] = useState<SelectableValue<Formats>>(FormatsOptions[0])

    const isInvalid = (value: string) => {
        return value.includes(" ") || value.toLowerCase() !== value
    }

    const handleOnSubmitFinal = () => {
        let json_data: any = {}
        try {
            if (selectedFormat.value === Formats.yaml) {
                json_data = yaml.load(currentAgent.data)
            } else {
                json_data = JSON.parse(currentAgent.data)
            }
        } catch (e: unknown) {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["The format selected is incorrect or the data entered is not a valid " + selectedFormat.value],
            });
            return
        }
        if (json_data['kind'] !== 'Deployment' && json_data['kind'] !== 'CronJob') {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Only Kubernetes deployments and cronjobs are accepted as agents"],
            });
            return
        }
        json_data = setNestedKey(json_data, ['metadata', 'labels', 'opentwins.agents/name'], currentAgent.name)
        console.log(json_data)
        createAgentService(context, currentAgent.id, currentAgent.namespace, json_data).then((res: any) => {
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: ["Agent successfully created"],
            });
            //setShowNotification(enumNotification.READY)
        }).catch(() => {
            console.log("error")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error when creating the agent, check its definition"],
            });
        })
    }

    const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentAgent({
            ...currentAgent,
            [event.currentTarget.name]: event.target.value
        })
    }

    const handleOnChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentAgent({
            ...currentAgent,
            [event.currentTarget.name]: event.target.value
        })
    }

    return <Fragment>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                {({ register, errors, control }: FormAPI<FormData>) => {
                    return (
                        <div style={{ minHeight: '100%' }}>
                            <h2 style={{ marginBottom: '20px' }}>Create new agent</h2>
                            <Field label="Identifier" required={true} description="A unique identifier for the agent" invalid={isInvalid(currentAgent.id)} error={isInvalid(currentAgent.id) ? InvalidMsg : ''}>
                                <Input {...register("id", { required: true })} type="text" value={currentAgent.id} onChange={handleOnChangeInput} />
                            </Field>

                            <Field label="Context" required={true} description="The context or namespace in which the agent operates, used for grouping agents" invalid={isInvalid(currentAgent.namespace)} error={isInvalid(currentAgent.namespace) ? InvalidMsg : ''}>
                                <Input {...register("namespace", { required: true })} type="text" value={currentAgent.namespace} onChange={handleOnChangeInput} />
                            </Field>

                            <Field label="Name" description="A readable name for the agent that does not need to be unique" required={true} invalid={currentAgent.name.includes(" ")} error={currentAgent.name.includes(" ") ? 'Blank spaces are not allowed' : ''}>
                                <Input {...register("name", { required: true })} type="text" value={currentAgent.name} onChange={handleOnChangeInput} />
                            </Field>

                            <Field style={{ marginBottom: '5px' }} label="Kubernetes agent definition" description="Kubernetes object that will be executed to simulate the behavior of the agent. It can be a deployment or a cronjob and can be specified in JSON or YAML format." required={true}>
                                <RadioButtonGroup options={FormatsOptions} value={selectedFormat.value} onChange={(v) => setSelectedFormat({ label: v, value: v })} />
                            </Field>

                            <TextArea style={{ resize: 'none', minHeight: '500px', flex: 1, overflow: "auto", boxSizing: 'border-box' }} {...register("data", { required: true })} cols={25} type="text" value={currentAgent.data} onChange={handleOnChangeTextArea} />

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                                <Button variant="primary" type="submit" form="finalForm">Create agent</Button>
                            </div>
                        </div>
                    )
                }}
            </Form>
        </div>
    </Fragment>
}
