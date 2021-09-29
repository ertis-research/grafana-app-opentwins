import React, { Fragment, ChangeEvent } from 'react'
import {Button, Input, Field, FieldSet, Checkbox, Form, FormAPI, List } from '@grafana/ui'
import { ISubject } from 'utils/interfaces/dittoPolicy'
import { ListElement } from 'components/general/listElement'
import { ElementHeader } from 'components/general/elementHeader'

interface parameters {
    subjects : ISubject[]
    setSubjects : any
}

export const FormSubjects = ({subjects, setSubjects} : parameters) => {

    const subjectDescription = "Who gets permissions granted/revoked on the resources of a policy entry"

    const handleOnSubmitSubject = (data:ISubject) => {
        setSubjects([
            ...subjects,
            data
        ])
    }

    const handleOnChangeCurrentUserCheckbox = (event:ChangeEvent<HTMLInputElement>) => {
        alert("cambio")
    }

    return (
        <Fragment>
            <ElementHeader title="Subjects" description={subjectDescription} isLegend={false}/>
            <div className="row">
                <div className="col-8">
                    <Checkbox className="mb-3" label="Add current user as subject" onChange={handleOnChangeCurrentUserCheckbox}/>
                    <Form id="subjectForm" onSubmit={handleOnSubmitSubject}>
                    {({register, errors}:FormAPI<ISubject>) => {
                        return(
                            <Fragment>
                                <FieldSet>
                                    <Field label="Subject-issuer" description="Party who issued the authentication">
                                        <Input {...register("subjectIssuer", { required : true })} type="text"/>
                                    </Field>
                                    <Field label="Subject" description="Username or ID from an actual subject">
                                        <Input {...register("subject", { required : true })} type="text"/>
                                    </Field>
                                    <Field label="Type" description="The type of the (Authorization) Subject. Intended for documentational purposes">
                                        <Input {...register("type", { required : true })} type="text"/>
                                    </Field>
                                    <Button variant="secondary">Add</Button>
                                </FieldSet>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-4">
                    <List 
                        items={subjects}
                        getItemKey={item => (item.subjectIssuer + ":" + item.subject)}
                        renderItem={item => ListElement((item.subjectIssuer + ":" + item.subject), subjects, setSubjects)}
                    />
                </div>
            </div>
        </Fragment>
    )
}