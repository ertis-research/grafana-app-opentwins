import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Button, Field, Input, Form, FormAPI, FieldSet, List, InputControl, Select, Icon } from '@grafana/ui'
import { ElementHeader } from 'components/general/elementHeader'
import { ListElement } from 'components/general/listElement'
import { IThingList, IThingType } from 'utils/interfaces/types'
import { getAllThingTypesService } from 'services/thingTypes/getAllThingTypesService'
import { getSelectWithObjectsFromThingTypesArray } from 'utils/aux_functions'
import { ISelect } from 'utils/interfaces/select'
import { SelectableValue } from '@grafana/data'
import { StaticContext } from 'utils/context/staticContext'

interface parameters {
    things : IThingList[]
    setThings : any
    disabled : boolean
}

export const FormThings = ({things, setThings, disabled} : parameters) => {

    const thingsDescription = "Attributes describe the Thing in more detail and can be of any type. They are typically used to model rather static properties at the Thing level."
    const [thingTypes, setThingTypes] = useState<ISelect[]>([])
    const [selectedThingType, setSelectedThingType] = useState<SelectableValue<IThingType>>()

    const context = useContext(StaticContext)

    const handleSubmitThings = (data:IThingList) => {
        if(selectedThingType !== undefined && selectedThingType.value !== undefined){
            data.thingTypeId = selectedThingType?.value?.thingTypeId

            var item = things.some(item => item.thingTypeId == data.thingTypeId)
    
            if(item === false) { 
                setThings([
                    ...things,
                    data
                ])
            } else {
                alert("ya existe")
            }
        }
    }

    useEffect(() => {
        getAllThingTypesService(context).then((res) => setThingTypes(getSelectWithObjectsFromThingTypesArray(res)))
    }, [])

    return (
        <Fragment>
            <ElementHeader title="Things" description={thingsDescription} isLegend={false}/>
            <div className="row">
                <div className="col-8">
                    <Form id="formThings" onSubmit={handleSubmitThings}>
                    {({register, errors, control}:FormAPI<IThingList>) => {
                        return (
                            <Fragment>
                                <FieldSet>
                                    <Field className="mt-3" label="Type of thing">
                                        <InputControl
                                            render={({field}) => 
                                            <Select {...field} 
                                                options={thingTypes}
                                                value={selectedThingType}
                                                onChange={v => setSelectedThingType(v)}
                                                prefix={<Icon name="arrow-down"/>} 
                                            />
                                            }
                                            control={control}
                                            name="thingTypeId"
                                        />
                                    </Field>
                                    <Field label="Number" disabled={disabled}>
                                        <Input {...register("number", { required : true })} type="number" disabled={disabled}/>
                                    </Field>
                                    <Button type="submit" variant="secondary" form="formThings" disabled={disabled}>Add</Button>
                                </FieldSet>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-4">
                    <List 
                        items={things}
                        getItemKey={item => (item.thingTypeId)}
                        renderItem={item => ListElement((item.thingTypeId + ": " + item.number), things, setThings, [{key: "thingTypeId", value: item.thingTypeId}, {key:"number", value: item.number.toString()}], disabled)}
                    />
                </div>
            </div>
        </Fragment>
    )
}