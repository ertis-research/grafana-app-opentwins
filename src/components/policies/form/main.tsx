import React, { useState, ChangeEvent, FormEvent, Fragment } from 'react'

import { TextArea, Input, Field, List, Legend, Button } from '@grafana/ui'
import { IEntry, IResource, ISubject } from 'utils/interfaces/dittoPolicy'
import { ListElement } from 'components/general/listElement'
import { initResources } from 'utils/consts'
import { FormSubjects } from './subcomponents/formSubjects'
import { FormResources } from './subcomponents/formResources'
import {} from '@emotion/core'

export function CreatePolicy() {

    const [text, setText] = useState("")
    const [entries, setEntries] = useState<IEntry[]>([])
    //const [currentEntry, setCurrentEntry] = useState<IEntry>()
    const [subjects, setSubjects] = useState<ISubject[]>([])
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
                            <FormSubjects subjects={subjects} setSubjects={setSubjects}/>
                            <hr />
                            <FormResources resources={resources} setResources={setResources} />
                            <hr />
                            <div className="d-flex justify-content-center">
                                <Button variant="secondary" form="entryForm">Add entry</Button>
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