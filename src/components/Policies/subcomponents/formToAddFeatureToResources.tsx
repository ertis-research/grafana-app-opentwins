import React, { Fragment } from 'react'
import { Button, Input, Field, useTheme2, Form, FormAPI } from '@grafana/ui'
import { IResource } from 'utils/interfaces'

interface parameters {
    resources : any
    setResources : any
}

export const FormToAddFeatureToResources = ({resources, setResources} : parameters) => {

    const onSubmit = (data:IResource) => {
        console.log(data)
        data.erasable = true
        setResources([...resources, data])
        console.log(resources)
    }

    return (
        <div className="my-3 p-3" style={{backgroundColor:useTheme2().colors.background.canvas}}>
            <Form onSubmit={onSubmit}>
            {({register, errors}:FormAPI<IResource>) => {
                return (
                    <Fragment>
                        <h4 className="text-capitalize">Feature</h4>
                        <Field label="Name of feature">
                            <Input {...register("name", { required: true })}/>
                        </Field>
                        <Button variant="secondary" type="submit">Add feature</Button>
                    </Fragment>
                )
            }}
            </Form>
        </div>
    )
}