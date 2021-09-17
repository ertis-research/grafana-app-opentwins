import React from 'react';
import {
    Button,
    Field,
    //TextArea,
    Input
  } from '@grafana/ui';

export function CreateMainObject() {

    const handleSubmit = () => {

    }

    return (
        <form onSubmit={handleSubmit}>
            <Field label="Name:">
              <Input name="objectName" type="text" placeholder="Name"/>
            </Field>
            <Field label="Image URL:">
              <Input name="imageUrl" type="text" placeholder="URL"/>
            </Field>
            <Field label="Description:">
              <Input name="description" type="text" placeholder="Description"/>
            </Field>
            <Button>Create new main object</Button>
        </form>
    );
}