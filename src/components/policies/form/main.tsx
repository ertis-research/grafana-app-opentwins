import React, { useState, Fragment, useEffect, ChangeEvent } from 'react'
import { TextArea, Input, Field, List, Legend, Button, Form, FormAPI, FieldSet } from '@grafana/ui'
import { IEntry, IPolicy, IResource, ISubject } from 'utils/interfaces/dittoPolicy'
import { ListElement } from 'components/general/listElement'
import { initResources, initSubjects } from 'utils/consts'
import { FormSubjects } from './subcomponents/formSubjects'
import { FormResources } from './subcomponents/formResources'
import {} from '@emotion/core'
import { createPolicyService } from 'services/policies/createPolicyService'

interface parameters {
    path : string
}

export function CreatePolicy( {path} : parameters ) {

    const [entries, setEntries] = useState<IEntry[]>([])
    const [entry, setEntry] = useState<IEntry>({ name: "" })
    const [currentPolicy, setCurrentPolicy] = useState<IPolicy>({ policyId: "", entries: []})
    const [subjects, setSubjects] = useState<ISubject[]>(initSubjects)
    const [resources, setResources] = useState<IResource[]>(initResources)

    const handleOnSubmitEntry = (data:{name:string}) => {
        setEntries([
            ...entries,
            {
                name: data.name,
                subjects: subjects,
                resources: resources
            }
        ])
    }

    useEffect(() => {
        var provEntries:any = {}
        entries.forEach((item) => {

            var provSubjects:any = {}
            var provResources:any = {}
            subjects.forEach((item) => provSubjects[item.subjectIssuer + ":" + item.subject]={type : item.type})
            resources.forEach((item) => {
                var grantList:any = []
                var revokeList:any = []

                if(item.read) {
                    grantList.push("READ")
                } else if (!item.read && item.read !== undefined) {
                    revokeList.push("READ")
                }

                if(item.write) {
                    grantList.push("WRITE")
                } else if (!item.write && item.write !== undefined) {
                    revokeList.push("WRITE")
                }

                provResources[item.name] = {
                    grant : grantList,
                    revoke : revokeList
                }
            })

            provEntries[item.name]={
                subjects : provSubjects,
                resources : provResources
            }
        })

        setCurrentPolicy({
            ...currentPolicy,
            entries : provEntries
        })

    }, [entries])

    useEffect(() => {
        setEntry({
            ...entry,
            subjects : subjects
        })
    }, [subjects])

    useEffect(() => {
        setEntry({
            ...entry,
            resources : resources
        })
    }, [resources])

    const handleOnSubmitFinal = (data:{name:string}) => {
        setCurrentPolicy({
            ...currentPolicy,
            policyId : data.name
        })
        createPolicyService(currentPolicy)
        window.location.replace(path + "?tab=policies")
    }

    const handleOnChangeInputName = (event:ChangeEvent<HTMLInputElement>) => {
        setCurrentPolicy({
          ...currentPolicy,
          policyId : event.target.value
        })
      }

    return (
        <Fragment>
            <h2>Create new policy</h2>
            <div className="row">
                <div className="col-9">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal}>
                    {({register, errors}:FormAPI<{name:string}>) => {
                        return(
                            <FieldSet>
                                <Field label="Name">
                                    <Input {...register("name", { required : true })} type="text" onChange={handleOnChangeInputName}/>
                                </Field>
                            </FieldSet>
                        )
                    }}
                    </Form>
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
                            <Form id="entryForm" onSubmit={handleOnSubmitEntry}>
                            {({register, errors}:FormAPI<{name:string}>) => {
                                return (
                                    <Field label="Name of entry">
                                        <Input {...register("name", { required : true })} type="text" form="entryForm"/>
                                    </Field>
                                )    
                            }}
                            </Form>
                            <hr />
                            <FormSubjects subjects={subjects} setSubjects={setSubjects}/>
                            <hr />
                            <FormResources resources={resources} setResources={setResources} />
                            <hr />
                            <div className="d-flex justify-content-center">
                                <Button variant="secondary" form="entryForm">Add entry</Button>
                            </div>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" form="finalForm">Create policy</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <Field label="Preview" className="h-100">
                        <TextArea value={JSON.stringify(currentPolicy, undefined, 4)} rows={25} readOnly/>
                    </Field>
                </div>
            </div>
        </Fragment>
    );
}