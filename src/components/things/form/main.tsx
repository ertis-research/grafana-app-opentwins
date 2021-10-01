import React, { useState, Fragment, useEffect, ChangeEvent } from 'react'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { Form, FormAPI, FieldSet, Field, Input, InputControl, Select, Icon, TextArea, Button } from '@grafana/ui'
import { SelectableValue } from '@grafana/data/types/select'
import { ISelect } from 'utils/interfaces/select'
import { getAllTypesService } from 'services/types/getAllTypesService'
import { getSelectWithObjectsFromDittoThingArray } from 'utils/aux_functions'
import { ElementHeader } from 'components/general/elementHeader'

interface parameters {
    path : string
    id : string
}

export const ThingForm = ({ path, id } : parameters) => {
    
    const [currentThing, setCurrentThing] = useState<IDittoThing>({ thingId: "", policyId: ""})
    const [value, setValue] = useState<SelectableValue<IDittoThing>>()
    //const [policies, setPolicies] = useState<ISelect[]>([])
    const [types, setTypes] = useState<ISelect[]>([])

    const descriptionCredentials = "Identity associated with the authentication credentials"

    const handleOnSubmitFinal = () => {

    }

    const handleOnChangeThingId = (event:ChangeEvent<HTMLInputElement>) => {
        setCurrentThing({
            ...currentThing,
            thingId : id + ":" + event.target.value
        })
    }

    useEffect(() => {
        if(value?.value !== undefined) {
            const type = value.value
            setCurrentThing({
                ...currentThing,
                policyId : type.policyId,
                definition : type.definition,
                attributes : type.attributes,
                features : type.features
            })
        }
    }, [value])

    useEffect(() => {
        getAllTypesService().then((res) => setTypes(getSelectWithObjectsFromDittoThingArray(res.items)))
    }, [])

    return (
        <Fragment>
            <h2>Create new thing</h2>
            <div className="row">
                <div className="col-8">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal}>
                    {({register, errors, control}:FormAPI<{thingId:string, type:IDittoThing, authid:string, password:string}>) => {
                        return(
                            <Fragment>
                                <FieldSet>
                                    <Field label="ID">
                                        <Input {...register("thingId", { required : true })} type="text" onChange={handleOnChangeThingId}/>
                                    </Field>
                                    <Field label="Type of thing">
                                        <InputControl
                                            render={({field}) => 
                                            <Select {...field} 
                                                options={types}
                                                value={value}
                                                onChange={v => setValue(v)}
                                                prefix={<Icon name="arrow-down"/>} 
                                            />
                                            }
                                            control={control}
                                            name="type"
                                        />
                                    </Field>
                                </FieldSet>
                                <ElementHeader title="Credentials for connection" description={descriptionCredentials} isLegend={true}/>
                                <FieldSet>
                                    <Field label="Auth-id">
                                        <Input {...register("authid", { required : true })} type="text"/>
                                    </Field>
                                    <Field label="Password">
                                        <Input {...register("password", { required : true })} type="password"/>
                                    </Field>
                                </FieldSet>
                                <Button variant="primary">Create thing</Button>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-4">
                    <Field label="Preview" className="h-100">
                        <TextArea value={JSON.stringify(currentThing, undefined, 4)} rows={25} readOnly/>
                    </Field>
                </div>
            </div>
        </Fragment>
    )
}