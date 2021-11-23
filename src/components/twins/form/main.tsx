import React, { Fragment, useState, useEffect, ChangeEvent } from 'react'
import { Button, Field, FieldSet, Input, FormAPI, Form, TextArea, InputControl, Select, Icon, Switch, RadioButtonGroup, HorizontalGroup } from '@grafana/ui'
import { ITwin } from 'utils/interfaces/dittoThing'
import { createTwinService } from 'services/twins/createTwinService'
import { ITwinType } from 'utils/interfaces/types'
import { SelectableValue } from '@grafana/data/types/select'
import { ISelect } from 'utils/interfaces/select'
import { getAllTwinTypesService } from 'services/twinTypes/getAllTwinTypes'
import { Control } from 'react-hook-form'
import { createTwinFromTypeService } from 'services/twins/createTwinFromTypeService'
//import { switchValueToBoolean } from 'utils/aux_functions'

interface parameters {
  path : string
}

const enumOptions = {
  FROM_TYPE: 0,
  FROM_ZERO: 1
}

export const CreateTwin = ({path}:parameters) => {

    const [lastCurrentTwin, setLastCurrentTwin] = useState<ITwin>({ twinId: "", name: "", image: "", description: ""})
    const [currentTwin, setCurrentTwin] = useState<ITwin>(lastCurrentTwin)
    const [value, setValue] = useState<SelectableValue<ITwinType>>()
    const [twinTypes, setTwinTypes] = useState<ISelect[]>([])
    const [selected, setSelected] = useState(enumOptions.FROM_TYPE)
    const [customizeType, setCustomizeType] = useState(false)

    const options = [
      {label: 'From existing type', value: enumOptions.FROM_TYPE},
      {label: 'From scratch', value: enumOptions.FROM_ZERO}
    ]

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
        twinId : aux.twinId
      })
      setLastCurrentTwin(aux)
    }

    const onSubmit = (data:ITwin) => {
      if(selected === enumOptions.FROM_TYPE && value?.value !== undefined){
        if(customizeType){
          createTwinFromTypeService(data.twinId, value.value, data).then(() =>
            window.location.replace(path)
          )
        } else {
          createTwinFromTypeService(data.twinId, value.value).then(() =>
            window.location.replace(path)
          )
        }
        
      } else {
        createTwinService(data).then(() =>
          window.location.replace(path)
        )
      }
    }

    useEffect(() => {
      getAllTwinTypesService().then((res) => 
        setTwinTypes(
          res.map((item:ITwinType) => {
            return {
              label : item.twinTypeId,
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
            name : type.name,
            description : type.description,
            image : type.image
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
                  options={twinTypes}
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
            {({register, errors, control}:FormAPI<ITwin>) => {
              return(
                <Fragment>
                  <FieldSet label="Create new twin">
                    <Field label="TwinId:" required={ true }>
                      <Input {...register("twinId", { required: true })} value={currentTwin.twinId} onChange={handleOnChangeInput}/>
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
}