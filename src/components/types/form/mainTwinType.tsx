import React, { Fragment } from 'react'
import { Button, Field, FieldSet, Input, FormAPI, Form } from '@grafana/ui'
import { createTwinTypeService } from 'services/twinTypes/createTwinTypeService'
import { ITwinType, ITwinTypeSimple } from 'utils/interfaces/types'

interface parameters {
  path : string
}

export const FormTwinType = ({path}:parameters) => {

    const onSubmit = (data:ITwinType) => {
      createTwinTypeService(data).then(() =>
        window.location.replace(path)
      )
    }

    return (
      <Form onSubmit={onSubmit}>
        {({register, errors}:FormAPI<ITwinTypeSimple>) => {
          return(
            <Fragment>
              <FieldSet label="Create new twin type">
                <Field label="Id:">
                  <Input {...register("twinTypeId", { required: true })}/>
                </Field> 
                <Field label="Name:">
                  <Input {...register("name", { required: true })}/>
                </Field>
                <Field label="Image URL:">
                  <Input {...register("image")} type="url"/>
                </Field>
                <Field label="Description:">
                <Input {...register("description")}/>
                </Field>
              </FieldSet>
              <Button variant="primary">Create</Button>
            </Fragment>
          )
        }}
      </Form>
    )
}