import React, { useState, ChangeEvent, FormEvent, Fragment } from 'react'
import { TextArea, Button, Input, Field, Checkbox, List, useTheme2, Legend } from '@grafana/ui'
import { Resource_permissions } from './subcomponents/resource_permissions'
import { IEntry, IResource } from 'utils/interfaces'
import { ListElement } from 'components/general/listElement'
import { initResources } from 'utils/consts'
import { FormToAddFeatureToResources } from './subcomponents/formToaddFeatureToResources'

export function CreatePolicy() {

    const [text, setText] = useState("")
    const [entries, setEntries] = useState<IEntry[]>([])
    //const [currentEntry, setCurrentEntry] = useState<IEntry>()
    //const [subjects, setSubjects] = useState<ISubject[]>([])
    const [resources, setResources] = useState<IResource[]>(initResources)

    const handleOnSubmitEntry = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            name: { value: string };
        };

        setEntries([
            ...entries,
            {name: target.name.value}
        ])
    }

    const handleOnSubmitFinal = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const handleOnSubmitSubject = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    

    const handleOnChangeText = (event:ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value)
    }

    return (
        <Fragment>
            <h2>Create new policy</h2>
            <div className="row">
                <form id="finalForm" onSubmit={handleOnSubmitFinal}/>
                <div className="col-9">
                    <Field label="Name of policy">
                        <Input name="name" type="text"/>
                    </Field>
                    <hr />
                    <div className="row">
                        <div className="col-3">
                            <Legend>Entries</Legend>
                            <List 
                                items={entries}
                                getItemKey={item => item.name}
                                renderItem={item => ListElement(item.name, entries, setEntries)}
                            />
                        </div>
                        <div className="col-9">
                            <Legend>Entry information</Legend>
                            <form id="entryForm" onSubmit={handleOnSubmitEntry}/>
                            <Field label="Name of entry">
                                <Input name="name" type="text" form="entryForm"/>
                            </Field>
                            <hr />
                            <h4 className="mb-0">Subjects</h4>
                            <p className="mt-0" style={{color:useTheme2().colors.text.secondary}}>Who gets permissions granted/revoked on the resources of a policy entry</p>
                            <form id="subjectForm" onSubmit={handleOnSubmitSubject}>
                                <Checkbox className="mb-3" label="Add current user as subject"/>
                                <Field label="Subject-issuer" description="Party who issued the authentication">
                                    <Input name="subject-issuer" type="text"/>
                                </Field>
                                <Field label="Subject" description="Username or ID from an actual subject">
                                    <Input name="subject" type="text"/>
                                </Field>
                                <Button variant="secondary">Add</Button>
                            </form>
                            <hr />
                            <h4 className="mb-0">Resources</h4>
                            <p className="mt-0" style={{color:useTheme2().colors.text.secondary}}>Assign the permissions that the subjects will have on each resource</p>
                            {resources.map(item => 
                                <Resource_permissions resource={item} resources={resources} setResources={setResources}/>
                            )}
                            <FormToAddFeatureToResources resources={resources} setResources={setResources}/>
                            <hr />
                            <div className="d-flex justify-content-center">
                                <Button variant="secondary">Add entry</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <Field label="Preview" className="w-100 h-100" style={{boxSizing: "border-box"}}>
                        <TextArea value={text} readOnly onChange={handleOnChangeText}/>
                    </Field>
                </div>
            </div>
        </Fragment>
    );
}