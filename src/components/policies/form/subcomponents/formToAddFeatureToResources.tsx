import React, { Fragment } from 'react'
import { Button, Input, Field, useTheme2, Form, FormAPI } from '@grafana/ui'
import { Resource } from 'utils/interfaces/dittoPolicy'

interface Parameters {
    resources: any
    setResources: any
}

export const FormToAddFeatureToResources = ({resources, setResources}: Parameters) => {

    const onSubmit = (data: Resource) => {
        data.erasable = true
        setResources([...resources, data])
        console.log(resources)
    }

    return (
        <div className="my-3 p-3" style={{backgroundColor:useTheme2().colors.background.canvas}}>
            <Form onSubmit={onSubmit}>
            {({register, errors}: FormAPI<Resource>) => {
                return (
                    <Fragment>
                        <h5 className="text-capitalize mb-0">Feature</h5>
                        <p className="mt-0" style={{color:useTheme2().colors.text.secondary}}>Will be applied to all or certain features/properties of a thing<br/>Example: thing:/features/featureX/properties/location/city</p>
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
