import React, { useState, Fragment, useEffect, ChangeEvent } from 'react'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { Form, FormAPI, FieldSet, Field, Input, InputControl, Select, Icon, TextArea, Button } from '@grafana/ui'
import { SelectableValue } from '@grafana/data/types/select'
import { ISelect } from 'utils/interfaces/select'
import { getAllThingTypesService } from 'services/thingTypes/getAllThingTypesService'
import { getSelectWithObjectsFromThingTypesArray } from 'utils/aux_functions'
import { ElementHeader } from 'components/general/elementHeader'
import { IThingType } from 'utils/interfaces/types'
import { createThingByTypeService } from 'services/things/createThingByTypeService'

interface parameters {
    path : string
    id : string
}

export const ThingForm = ({ path, id } : parameters) => {
    
    const [currentThing, setCurrentThing] = useState<IDittoThing>({ thingId: "", policyId: ""})
    const [value, setValue] = useState<SelectableValue<IThingType>>()
    //const [policies, setPolicies] = useState<ISelect[]>([])
    const [thingTypes, setThingTypes] = useState<ISelect[]>([])

    const descriptionCredentials = "Identity associated with the authentication credentials"
    const descriptionInformation = "Basic information for creating the Ditto thing"

    const handleOnSubmitFinal = (data:{thingId:string, type:IThingType, authid:string, password:string}) => {
        currentThing.thingId = data.thingId
        /*createThingService(currentThing, id, data.authid, data.password).then(() => 
            alert("CREADO")
            //window.location.replace(path + "?mode=check&id=" + id)
        )*/
        if(value?.value !== undefined){
            createThingByTypeService(data.thingId, value.value.thingTypeId, id, data.authid, data.password).then(() => 
            alert("CREADO")
        //window.location.replace(path + "?mode=check&id=" + id)
        )
        }
        

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
        getAllThingTypesService().then((res) => setThingTypes(getSelectWithObjectsFromThingTypesArray(res)))
    }, [])

    return (
        <Fragment>
            <h2>Create new thing</h2>
            <div className="row">
                <div className="col-6">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal}>
                    {({register, errors, control}:FormAPI<{thingId:string, type:IThingType, authid:string, password:string}>) => {
                        return(
                            <Fragment>
                                <ElementHeader title="Thing information" description={descriptionInformation} isLegend={true}/>
                                <FieldSet>
                                    <Field label="ID">
                                        <Input {...register("thingId", { required : true })} type="text" onChange={handleOnChangeThingId}/>
                                    </Field>
                                    <Field label="Type of thing">
                                        <InputControl
                                            render={({field}) => 
                                            <Select {...field} 
                                                options={thingTypes}
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
                                <hr />
                                <ElementHeader title="Credentials for connection" description={descriptionCredentials} isLegend={true}/>
                                <FieldSet>
                                    <Field label="Auth-id">
                                        <Input {...register("authid", { required : true })} type="text"/>
                                    </Field>
                                    <Field label="Password">
                                        <Input {...register("password", { required : true })} type="password"/>
                                    </Field>
                                </FieldSet>
                                <hr />
                                <Button variant="primary">Create thing</Button>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-6">
                    <Field label="Preview" className="h-100">
                        <TextArea value={JSON.stringify(currentThing, undefined, 4)} rows={25} readOnly/>
                    </Field>
                </div>
            </div>
        </Fragment>
    )
}