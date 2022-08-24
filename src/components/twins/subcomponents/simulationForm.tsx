import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Button, Field, FieldSet, Form, FormAPI, Input } from '@grafana/ui'
import React, { Fragment } from 'react'
import { simulationAttributesForm } from 'utils/interfaces/simulation'

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
}

export const SimulationForm = ({path, meta} : parameters) => {

    //const [method, setMethod] = useState<SelectableValue<MethodRequest>>()
    //const [contentType, setContentType] = useState<SelectableValue<MethodRequest>>()

    const handleOnSubmit = () => {

    }


    return (
        <div className="row">
            <div className="col-5">
                <Form id="formSimulation" onSubmit={handleOnSubmit} maxWidth="none">
                {({register, errors}:FormAPI<simulationAttributesForm>) => {
                    return (
                        <Fragment>
                            <FieldSet>
                                <Field label="Id">
                                    <Input {...register("id", { required : true })} type="text" />
                                </Field>
                                <Field label="Value">
                                    <Input {...register("url", { required : true })} type="url" />
                                </Field>
                                <Button type="submit" variant="primary" form="formSimulation">Add</Button>
                            </FieldSet>
                        </Fragment>
                    )
                }}
                </Form>
            </div>
            <div className="col-7">
                
            </div>
        </div>
    )
}