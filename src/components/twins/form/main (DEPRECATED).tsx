/*import React, { Fragment, useState, useEffect, useContext, ChangeEvent } from 'react'
import { Button, Field, FieldSet, Input, FormAPI, Form, TextArea, InputControl, Select, Icon, Switch, RadioButtonGroup, HorizontalGroup } from '@grafana/ui'
import { IDittoThing, IDittoThingForm } from 'utils/interfaces/dittoThing'
import { createOrUpdateTwinByIdService } from 'services/twins/crud/createOrUpdateTwinByIdService'
import { SelectableValue } from '@grafana/data/types/select'
import { ISelect } from 'utils/interfaces/select'
import { Control } from 'react-hook-form'
import { createTwinFromTypeService } from 'services/types/createTwinFromTypeService'
import { enumOptions, options } from 'utils/data/consts'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { StaticContext } from 'utils/context/staticContext'
import { getAllRootTypesService } from 'services/types/getAllRootTypesService'
//import { switchValueToBoolean } from 'utils/aux_functions'

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
}

const enumNotification = {
    SUCCESS : "success",
    ERROR : "error",
    HIDE : "hide"
}

export const CreateTwin = ({path}:parameters) => {

    const [lastCurrentTwin, setLastCurrentTwin] = useState<IDittoThing>({ thingId: "", policyId: "" })
    const [currentTwin, setCurrentTwin] = useState<IDittoThing>(lastCurrentTwin)
    const [value, setValue] = useState<SelectableValue<IDittoThing>>()
    const [types, setTypes] = useState<ISelect[]>([])
    const [selected, setSelected] = useState(enumOptions.FROM_TYPE)
    const [customizeType, setCustomizeType] = useState(false)
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)

    const context = useContext(StaticContext)

    const messageSuccess = "The twin has been created correctly. You can leave this page if you do not want to create any more."
    const messageError = "The twin has not been created correctly. Please check the data you have entered."

    const handleOnChangeInput = (event:ChangeEvent<HTMLInputElement>) => {
      setCurrentTwin({
          ...currentTwin,
          [event.currentTarget.name] : event.target.value
      })
    }

    const handleOnChangeFrom = (value:number) => {
      setSelected(value)
      const aux = currentTwin
      setCurrentTwin({
        ...lastCurrentTwin,
        thingId : aux.thingId
      })
      setLastCurrentTwin(aux)
    }

    const onSubmit = (data:IDittoThingForm) => {

      if(selected === enumOptions.FROM_TYPE && value?.value !== undefined){
        if(customizeType){
          createTwinFromTypeService(context, data.thingId, value.value.thingId, data).then(() =>
            setShowNotification(enumNotification.SUCCESS)
          )
        } else {
          createTwinFromTypeService(context, data.thingId, value.value.thingId).then(() =>
            setShowNotification(enumNotification.SUCCESS)
          )
        }
        
      } else {
        createOrUpdateTwinByIdService(context, data).then(() =>
          setShowNotification(enumNotification.SUCCESS)
        )
      }
    }

    useEffect(() => {
      getAllRootTypesService(context).then((res) => 
        setTypes(
          res.map((item:IDittoThing) => {
            return {
              label : item.thingId,
              value : item
            }
          })
        )
      )
    }, [])

    useEffect(() => {
    }, [selected])

    useEffect(() => {
      if(value?.value !== undefined) {
        const type = value.value
        setCurrentTwin({
            ...currentTwin,
            definition : type.definition,
            attributes : type.attributes,
            features : type.features,
            policyId : type.policyId
        })
      }
    }, [value, customizeType])

    const typeForm = (control:Control<ITwin>) => {
      return (
        <Fragment>
          <Field className="mt-3" label="Type of twin" required={true}>
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
          <Field label="Customize some property of the type for this twin">
            <Switch value={customizeType} onChange={v => {
              setCustomizeType(!customizeType)
            }}/>
          </Field>
        </Fragment>
      )
    }

    return (
      <div className="row">
        <div className="col-6">
          <Form onSubmit={onSubmit}>
            {({register, errors, control}:FormAPI<IDittoThingForm>) => {
              return(
                <Fragment>
                  <FieldSet label="Create new twin">
                    <Field label="TwinId:" required={ true }>
                      <Input {...register("thingId", { required: true })} value={currentTwin.thingId} onChange={handleOnChangeInput}/>
                    </Field> 
                    <HorizontalGroup justify='center'>
                      <RadioButtonGroup
                        options={options}
                        value={selected}
                        onChange={handleOnChangeFrom}
                      />
                    </HorizontalGroup>
                    {(selected === enumOptions.FROM_TYPE) ? typeForm(control) : (<div></div>)}
                    <Field label="Name:" required={ selected === enumOptions.FROM_ZERO } disabled={!customizeType && selected === enumOptions.FROM_TYPE}>
                      <Input {...register("name")} value={currentTwin.name} onChange={handleOnChangeInput} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    </Field>
                    <Field label="Image URL:" disabled={!customizeType && selected === enumOptions.FROM_TYPE}>
                      <Input {...register("image")} type="url" value={currentTwin.image} onChange={handleOnChangeInput} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    </Field>
                    <Field label="Description:" disabled={!customizeType && selected === enumOptions.FROM_TYPE}>
                      <Input {...register("description")} value={currentTwin.description} onChange={handleOnChangeInput} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    </Field>

                    <HorizontalGroup justify='center'>
                      <Button variant="primary" type="submit">Create</Button>
                    </HorizontalGroup>
                  </FieldSet>
                </Fragment>
              )
            }}
          </Form>
        </div>
        <div className="col-6">
          <Field label="Preview" className="h-100">
            <TextArea value={JSON.stringify(currentTwin, undefined, 4)} rows={25} readOnly/>
          </Field>
        </div>
      </div>
      
    )
}*/