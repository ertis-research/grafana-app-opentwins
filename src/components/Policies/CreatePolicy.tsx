import React, { useState, ChangeEvent, FormEvent, Fragment } from 'react'
import { 
    TextArea,
    Button,
    Input,
    Field,
    Checkbox,
    List
} from '@grafana/ui'
import { Resource_permissions } from './subcomponents/resource_permissions'
import { IEntry, IResource } from 'utils/interfaces'
import { ListElement } from 'components/general/listElement'

export function CreatePolicy() {

    const initResources = [
        {name: "thing", read: undefined, write: undefined},
        {name: "policy", read: undefined, write: undefined},
        {name: "message", read: undefined, write: undefined}
    ]

    const newResource = { name: undefined, read: undefined, write: undefined}

    const [text, setText] = useState("")
    const [entries, setEntries] = useState<IEntry[]>([])
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

    const handleOnSubmitFinal = () => {

    }

    const handleOnSubmitSubject = () => {

    }

    const handleOnSubmitResource = () => {
        setResources(resources)
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
                            <h3>Entries</h3>
                            <List 
                                items={entries}
                                getItemKey={item => item.name}
                                renderItem={item => ListElement(item.name)}
                            />
                        </div>
                        <div className="col-9">
                            <h3>Entry information</h3>
                            <form id="entryForm" onSubmit={handleOnSubmitEntry}>
                                <Field label="Name of entry">
                                    <Input name="name" type="text"/>
                                </Field>
                                <hr />
                                <h4>Subjects</h4>
                                <p>Who gets permissions granted/revoked on the resources of a policy entry</p>
                                <form id="subjectForm" onSubmit={handleOnSubmitSubject}>
                                    <Checkbox label="Add current user as subject"/>
                                    <Field label="Subject-issuer">
                                        <Input name="subject-issuer" type="text"/>
                                    </Field>
                                    <Field label="Subject" description="adsaddd sdsa dsa dsa d sad sad sa d">
                                        <Input name="subject" type="text"/>
                                    </Field>
                                    <Button variant="secondary">Add</Button>
                                </form>
                                <hr />
                                <h4>Resources</h4>
                                <p>Assign the permissions that the subjects will have on each resource</p>
                                {resources.map(item => 
                                    <Resource_permissions resource={item} handleSubmit={handleOnSubmitResource}/>
                                )}
                                <Resource_permissions resource={newResource} handleSubmit={handleOnSubmitResource}/>
                                <hr />
                                <div className="d-flex justify-content-center">
                                    <Button>Add entry</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <Field label="Preview" className="w-100 h-100">
                        <TextArea value={text} className="w-100 h-100" style={{boxSizing: "border-box"}} readOnly onChange={handleOnChangeText}/>
                    </Field>
                </div>
            </div>
        </Fragment>
    );
}