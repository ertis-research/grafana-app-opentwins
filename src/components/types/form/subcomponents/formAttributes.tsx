import React, { Fragment } from 'react'
import { IAttribute } from 'utils/interfaces/dittoThing'
import { Button, Field, Input, Form, FormAPI, FieldSet } from '@grafana/ui'
import { ElementHeader } from 'components/general/elementHeader'

interface parameters {
    attributes : IAttribute[]
    setAttributes : any
}

export const FormAttributes = ({attributes, setAttributes} : parameters) => {

    const attributeDescription = "Attributes describe the Thing in more detail and can be of any type. They are typically used to model rather static properties at the Thing level."

    const handleSubmitAttributes = (data:IAttribute) => {
        var found = false
        const newAttributes = attributes.map((item:IAttribute) => {
            if(item.key === data.key){
                var updatedItem = undefined
                updatedItem = {
                    ...item,
                    value : data.value
                }
                found = true
                return updatedItem
            }
            return item
        })
        if(found) {
            setAttributes(newAttributes)
        } else {
            setAttributes([
                ...attributes,
                data
            ])
        }
        
      }

    return (
        <Fragment>
            <ElementHeader title="Attributes" description={attributeDescription} isLegend={true}/>
            <Form onSubmit={handleSubmitAttributes}>
            {({register, errors}:FormAPI<IAttribute>) => {
                return (
                    <Fragment>
                        <FieldSet>
                            <Field label="Name:">
                                <Input {...register("key", { required : true })} type="text"/>
                            </Field>
                            <Field label="Value:">
                                <Input {...register("value", { required : true })} type="text"/>
                            </Field>
                            <Button type="submit" variant="secondary">Add attribute</Button>
                        </FieldSet>
                    </Fragment>
                )
            }}
            </Form>
        </Fragment>
    )
}