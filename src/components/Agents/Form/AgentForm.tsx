import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { Button, Field, Form, FormAPI, Input, MultiSelect, RadioButtonGroup, TextArea } from '@grafana/ui'
import React, { ChangeEvent, Fragment, useContext, useEffect, useState } from 'react'
import { setNestedKey } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import yaml from 'js-yaml'
import { getAppEvents } from '@grafana/runtime'
import { SelectData } from 'utils/interfaces/select'
import { checkIsEditor } from 'utils/auxFunctions/auth'
import { getAllTwinsIdsService } from 'services/TwinsService'
import { createAgentService } from 'services/AgentsService'
import { useHistory, useRouteMatch } from 'react-router-dom'
import logger from 'utils/logger'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    id?: string
}

interface FormData {
    id: string,
    namespace: string,
    data: string,
    name: string,
    twins: string[]
}

enum Formats {
    json = 'JSON',
    yaml = 'YAML'
}

const FormatsOptions = [
    { label: Formats.json, value: Formats.json },
    { label: Formats.yaml, value: Formats.yaml }
]

export function AgentForm({ path, meta, id }: Parameters) {

    const InvalidMsg = "Blank spaces, uppercase letters and underscores are not allowed"

    const context = useContext(StaticContext)
    const hasSetContext: boolean = context.agent_context !== undefined && context.agent_context.trim() !== ''

    const appEvents = getAppEvents()
    const history = useHistory()
    const { url } = useRouteMatch();

    const [currentAgent, setCurrentAgent] = useState<FormData>({ id: '', namespace: '', data: '', twins: [], name: '' })
    const [selectedFormat, setSelectedFormat] = useState<SelectableValue<Formats>>(FormatsOptions[0])
    const [value, setValue] = useState<Array<SelectableValue<string>>>([]);
    const [twins, setTwins] = useState<SelectData[]>([])

    const goBackToList = () => {
        const listPath = url.split('/agents')[0] + '/agents';
        history.push(listPath);
    }

    const isInvalid = (value: string) => {
        return value.includes(" ") || value.toLowerCase() !== value || value.includes("_")
    }

    const getTwins = () => {
        getAllTwinsIdsService().then((res: string[]) => {
            setTwins(res.map((id: string) => {
                return { value: id, label: id }
            }))
        }).catch(() => {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error getting the identifiers of digital twins"],
            });
        })
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
        json_data = setNestedKey(json_data, ['metadata', 'labels', 'opentwins.agents/twins'], value.map((v) => v.value))
        console.log(JSON.stringify(json_data))
        createAgentService(currentAgent.id, currentAgent.namespace, json_data).then((res: any) => {
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

    useEffect(() => {
        checkIsEditor().then((res) => {
            if (!res) {
                logger.warn("[Auth] User lacks permissions. Redirecting.");
                history.replace('/');
            }
        })
        getTwins()
    }, [])

    useEffect(() => {
        setCurrentAgent({
            ...currentAgent,
            namespace: context.agent_context
        })
    }, [context])

    useEffect(() => {
        if (!value.some((s) => s.value === id)) {
            setValue([
                ...value,
                { label: id, value: id }
            ])
        }
    }, [id])


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
        <div style={{ marginBottom: 20 }}>
            <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                Back to list
            </Button>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                {({ register, errors, control }: FormAPI<FormData>) => {
                    return (
                        <div style={{ minHeight: '100%' }}>
                            <h2 style={{ marginBottom: '20px' }}>Create new agent</h2>

                            <Field label="Context" required={true} disabled={hasSetContext} description="The context or namespace in which the agent operates, used for grouping agents" invalid={isInvalid(currentAgent.namespace)} error={isInvalid(currentAgent.namespace) ? InvalidMsg : ''}>
                                <Input {...register("namespace", { required: !hasSetContext })} disabled={hasSetContext} type="text" value={currentAgent.namespace} onChange={handleOnChangeInput} />
                            </Field>

                            <Field label="Identifier" required={true} description="A unique identifier for the agent" invalid={isInvalid(currentAgent.id)} error={isInvalid(currentAgent.id) ? InvalidMsg : ''}>
                                <Input {...register("id", { required: true })} type="text" value={currentAgent.id} onChange={handleOnChangeInput} />
                            </Field>

                            <Field label="Name" description="A readable name for the agent that does not need to be unique" required={true} invalid={currentAgent.name.includes(" ")} error={currentAgent.name.includes(" ") ? 'Blank spaces are not allowed' : ''}>
                                <Input {...register("name", { required: true })} type="text" value={currentAgent.name} onChange={handleOnChangeInput} />
                            </Field>

                            <Field style={{ width: '100%' }} label="Related digital twins" description="Digital twins to which this agent is related. This field is optional, but recommended to keep a reference with involved digital twins" required={false} invalid={currentAgent.name.includes(" ")} error={currentAgent.name.includes(" ") ? 'Blank spaces are not allowed' : ''}>
                                <MultiSelect
                                    options={twins}
                                    value={value}
                                    onChange={v => setValue(v)} />
                            </Field>

                            <Field style={{ marginBottom: '5px' }} label="Kubernetes agent definition" description="Kubernetes object that will be executed to simulate the behavior of the agent. It can be a deployment or a cronjob and can be specified in JSON or YAML format." required={true}>
                                <RadioButtonGroup options={FormatsOptions} value={selectedFormat.value} onChange={(v) => setSelectedFormat({ label: v, value: v })} />
                            </Field>

                            <TextArea style={{ resize: 'none', minHeight: '500px', flex: 1, overflow: "auto", boxSizing: 'border-box' }} {...register("data", { required: true })} cols={25} type="text" value={currentAgent.data} onChange={handleOnChangeTextArea} />

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                                <Button variant="secondary" onClick={goBackToList}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" form="finalForm">Create agent</Button>
                            </div>
                        </div>
                    )
                }}
            </Form>
        </div>
    </Fragment>
}
