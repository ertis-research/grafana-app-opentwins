import React, { Fragment } from 'react'
import { Button, Field, FieldSet, Input, FormAPI, Form } from '@grafana/ui'
import { ITwin } from 'utils/interfaces/dittoThing'
import { createTwinService } from 'services/twins/createTwinService'

export const CreateTwin = (props:any) => {

    const onSubmit = (data:ITwin) => {
      createTwinService(data)
    }

    return (
      <Form onSubmit={onSubmit}>
        {({register, errors}:FormAPI<ITwin>) => {
          return(
            <Fragment>
              <FieldSet label="Create new twin">
                <Field label="Id:">
                  <Input {...register("id", { required: true })}/>
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