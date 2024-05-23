import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Button, Field, Form, FormAPI, Input, TextArea} from '@grafana/ui'
import React, { ChangeEvent, Fragment, useContext, useState } from 'react'
import { createAgentService } from 'services/agents/createAgentService'
import { StaticContext } from 'utils/context/staticContext'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

interface FormData {
    id: string,
    namespace: string,
    data: string
}

export function CreateFormAgent({ path, meta }: Parameters) {

    const context = useContext(StaticContext)

    const [currentAgent, setCurrentAgent] = useState<FormData>({id: '', namespace: '', data: ''})

    const handleOnSubmitFinal = () => {
        createAgentService(context, currentAgent.id, currentAgent.namespace, currentAgent.data).then((res: any) => {
            alert("creado")
            //setShowNotification(enumNotification.READY)
        }).catch(() => console.log("error"))
    }

    const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentAgent({
            ...currentAgent,
            [event.currentTarget.name] : event.target.value
        })
    }

    const handleOnChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentAgent({
            ...currentAgent,
            [event.currentTarget.name] : event.target.value
        })
    }

    return <Fragment>
        <div style={{ width: '100%', display:'flex', justifyContent: 'center'}}>
            <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                {({ register, errors, control }: FormAPI<FormData>) => {
                    return (
                        <Fragment>
                            <h2 style={{ marginBottom: '20px'}}>Create new agent</h2> 

                            <Field label="Identification" required={true} >
                                <Input {...register("id", { required: true })} type="text" value={currentAgent.id} onChange={handleOnChangeInput}/>
                            </Field>

                            <Field label="Namespace / Context" required={true} >
                                <Input {...register("namespace", { required: true })} type="text" value={currentAgent.namespace} onChange={handleOnChangeInput}/>
                            </Field>

                            <Field label="Kubernetes JSON definition" required={true} >
                                <TextArea {...register("data", { required: true })} cols={25} type="text" value={currentAgent.data} onChange={handleOnChangeTextArea}/>
                            </Field>

                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button variant="primary" type="submit" form="finalForm">Create agent</Button>
                            </div>
                        </Fragment>
                    )
                }}
            </Form>
        </div>
    </Fragment>
}
