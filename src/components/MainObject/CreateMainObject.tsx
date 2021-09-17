import React, { FormEvent } from 'react';
import {
    Button,
    Field,
    //TextArea,
    Input
  } from '@grafana/ui';
import { createMainObjectService } from 'services/mainObjects/createMainObjectService';

export function CreateMainObject() {

    const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as typeof event.target & {
        objectId: { value: string };
        objectName: { value: string };
        imageUrl: { value: string };
        description: { value: string };
      };

      createMainObjectService(target.objectId.value, target.objectName.value, target.imageUrl.value, target.description.value)
    }

    return (
      <form onSubmit={handleSubmit}>
        <Field label="Id:">
          <Input name="objectId" type="text" placeholder="Id"/>
        </Field>
        <Field label="Name:">
          <Input name="objectName" type="text" placeholder="Name"/>
        </Field>
        <Field label="Image URL:">
          <Input name="imageUrl" type="url" placeholder="URL"/>
        </Field>
        <Field label="Description:">
          <Input name="description" type="text" placeholder="Description"/>
        </Field>
        <Button>Create new main object</Button>
      </form>
    );
}