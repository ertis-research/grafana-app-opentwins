import React, { Fragment } from 'react'
import { Button, Field, Input, Form, FormAPI, Legend } from '@grafana/ui'
import { IFeature } from 'utils/interfaces/dittoThing';
import {} from '@emotion/core';

interface parameters {
    features : IFeature[]
    setFeatures : any
}

export const FormFeatures = ({features, setFeatures} : parameters) => {

    const handleSubmitFeatures = (data : {name:string}) => {
        var item = features.some(item => item.name == data.name);
    
        if(item === false) { 
            setFeatures([
                ...features,
                {
                    name : data.name,
                    properties : {
                        value : null
                    }
                }
            ])
        } else {
          alert("ya existe");
        }
    }
    
    return (
        <Fragment>
            <Legend className="mt-3">Add a new feature:</Legend>
            <Form onSubmit={handleSubmitFeatures}>
            {({register, errors}:FormAPI<{name:string}>) => {
                return (
                    <Fragment>
                        <Field label="Name of feature:">
                            <Input {...register("name", { required : true })} type="text"/>
                        </Field>
                        <Button type="submit" variant="secondary">Add feature</Button>
                    </Fragment>
                )
            }}
            </Form>
        </Fragment>
    )
}