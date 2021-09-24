import React, { Fragment } from 'react'
import { Button, Field, FieldSet, Input, FormAPI, Form } from '@grafana/ui'
import { IMainObject } from 'utils/interfaces'
import { createMainObjectService } from 'services/mainObjects/createMainObjectService'

export const CreateMainObject = (props:any) => {

    const onSubmit = (data:IMainObject) => {
      createMainObjectService(data)
    }

    return (
      <Form onSubmit={onSubmit}>
        {({register, errors}:FormAPI<IMainObject>) => {
          return(
            <Fragment>
              <FieldSet label="Create new main object">
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