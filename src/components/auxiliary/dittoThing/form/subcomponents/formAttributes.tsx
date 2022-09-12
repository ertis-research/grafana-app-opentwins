import React, { Fragment } from 'react'
import { IAttribute } from 'utils/interfaces/dittoThing'
import { Button, Field, Input, Form, FormAPI, FieldSet, List } from '@grafana/ui'
import { ElementHeader } from 'components/auxiliary/general/elementHeader'
import { ListElement } from 'components/auxiliary/general/listElement'

interface parameters {
    attributes : IAttribute[]
    setAttributes : any
    disabled : boolean
}

export const FormAttributes = ({attributes, setAttributes, disabled} : parameters) => {

    const attributeDescription = "Attributes describe the Thing in more detail and can be of any type. They are typically used to model rather static properties at the Thing level."

    const handleSubmitAttributes = (data:IAttribute) => {
        var found = false
        const newAttributes = attributes.map((item:IAttribute) => {
            if(item.key === data.key){
                var updatedItem:any = undefined
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
            <ElementHeader title="Attributes" description={attributeDescription} isLegend={false}/>
            <div className="row">
                <div className="col-6">
                    <Form id="formAttributes" onSubmit={handleSubmitAttributes} maxWidth="none">
                    {({register, errors}:FormAPI<IAttribute>) => {
                        return (
                            <Fragment>
                                <FieldSet>
                                    <Field label="Name" disabled={disabled}>
                                        <Input {...register("key", { required : true })} type="text" disabled={disabled}/>
                                    </Field>
                                    <Field label="Value" disabled={disabled}>
                                        <Input {...register("value", { required : true })} type="text" disabled={disabled}/>
                                    </Field>
                                    <Button type="submit" variant="secondary" form="formAttributes" disabled={disabled}>Add</Button>
                                </FieldSet>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-6">
                    <List 
                        items={attributes}
                        getItemKey={item => (item.key)}
                        renderItem={item => ListElement((item.key + ":" + item.value), attributes, setAttributes, [{key: "key", value: item.key}, {key:"value", value: item.value}], disabled)}
                    />
                </div>
            </div>
        </Fragment>
    )
}