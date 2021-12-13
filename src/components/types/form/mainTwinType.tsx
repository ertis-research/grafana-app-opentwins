import React, { Fragment, useState, useContext, ChangeEvent } from 'react'
import { Button, Field, FieldSet, Input, FormAPI, Form, TextArea } from '@grafana/ui'
import { createTwinTypeService } from 'services/twinTypes/createTwinTypeService'
import { IThingList, ITwinType, ITwinTypeSimple } from 'utils/interfaces/types'
import { FormThings } from 'components/types/form/subcomponents/formThings'
import { StaticContext } from 'utils/context/staticContext'

interface parameters {
  path : string
}

export const FormTwinType = ({path}:parameters) => {

    const [currentTwinType, setCurrentTwinType] = useState<ITwinType>({twinTypeId: "", name: "", things:[]})

    const context = useContext(StaticContext)

    const onSubmit = (data:ITwinType) => {
      setCurrentTwinType(data)
      createTwinTypeService(context, data).then(() =>
        window.location.replace(path)
      )
    }

    const handleOnChangeInput = (event:ChangeEvent<HTMLInputElement>) => {
      setCurrentTwinType({
          ...currentTwinType,
          [event.currentTarget.name] : event.target.value
      })
    }

    const setThings = (newThings:IThingList[]) => {
      setCurrentTwinType({
          ...currentTwinType,
          things : newThings
        }
      )
    }

    return (
      <div className="row">
        <div className="col-8">
          <Form id="formtwintype" onSubmit={onSubmit}>
            {({register, errors}:FormAPI<ITwinTypeSimple>) => {
              return(
                <Fragment>
                  <FieldSet label="Create new twin type">
                    <Field label="Id:">
                      <Input {...register("twinTypeId", { required: true })} value={currentTwinType.twinTypeId} onChange={handleOnChangeInput}/>
                    </Field> 
                    <Field label="Name:">
                      <Input {...register("name", { required: true })} value={currentTwinType.name} onChange={handleOnChangeInput}/>
                    </Field>
                    <Field label="Image URL:">
                      <Input {...register("image")} type="url" value={currentTwinType.image} onChange={handleOnChangeInput}/>
                    </Field>
                    <Field label="Description:">
                    <Input {...register("description")} value={currentTwinType.description} onChange={handleOnChangeInput}/>
                    </Field>
                  </FieldSet>
                </Fragment>
              )
            }}
          </Form>
          <FormThings things={(currentTwinType.things !== undefined) ? currentTwinType.things : []} setThings={setThings} disabled={false}/>
          <Button variant="primary" form="formtwintype">Create twinType</Button>
        </div>
        <div className="col-4">
          <Field label="Preview" className="h-100">
            <TextArea value={JSON.stringify(currentTwinType, undefined, 4)} rows={25} readOnly/>
          </Field>
        </div>
      </div>
    )
}