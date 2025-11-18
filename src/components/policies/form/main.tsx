import React, { useState, Fragment, useEffect, useContext, ChangeEvent } from 'react'
import { TextArea, Input, Field, List, Legend, Button, Form, FormAPI, FieldSet } from '@grafana/ui'
import { Entry, Policy, Resource, Subject } from 'utils/interfaces/dittoPolicy'
import { ListElement } from 'components/auxiliary/general/listElement'
import { initResources, initSubjects } from 'utils/data/consts'
import { FormSubjects } from './subcomponents/formSubjects'
import { FormResources } from './subcomponents/formResources'
import { StaticContext } from 'utils/context/staticContext'
import { Notification } from 'utils/interfaces/notification'
import { enumNotification } from 'utils/auxFunctions/general'
import { CustomNotification } from 'components/auxiliary/general/notification'
import { createOrUpdatePolicyService, getPolicyByIdService } from 'services/PoliciesService'

interface Parameters {
    path: string
    id?: string
}

export const FormPolicy = ({path, id}: Parameters ) => {

    const [entries, setEntries] = useState<Entry[]>([])
    const [entry, setEntry] = useState<Entry>({ name: "", subjects: initSubjects, resources: initResources})
    const [currentPolicy, setCurrentPolicy] = useState<Policy>({ policyId: "", entries: []})
    const [showNotification, setShowNotification] = useState<Notification>({state: enumNotification.HIDE, title: ""})
    //const [subjects, setSubjects] = useState<Subject[]>(initSubjects)
    //const [resources, setResources] = useState<Resource[]>(initResources)

    const context = useContext(StaticContext)


// -----------------------------------------------------------------------------------------------
// Aux functions
// -----------------------------------------------------------------------------------------------

    const notificationError: Notification = {
        state: enumNotification.ERROR,
        title: `The policy has not been ${(id) ? "edited" : "created"} correctly. `,
        description: "Please check the data you have entered."
    }

    const notificationSuccess: Notification = (id) ? {
        state: enumNotification.SUCCESS,
        title: `The policy has been edited correctly. `,
        description: `You can leave the page if you don't want to edit any more.`
    } : {
        state: enumNotification.SUCCESS,
        title: `The policy has been created correctly. `,
        description: `You can delete the fields to create a new policy, keep them if you want to create a similar one or leave the page if you don't want to create any more.`,
    }

    const setSubjects = (newSubjects: Subject[]) => {
        setEntry({
            ...entry,
            subjects : newSubjects
        })
    }

    const setResources = (newResources: Resource[]) => {
        setEntry({
            ...entry,
            resources : newResources
        })
    }

    const setPolicy = (policy: Policy) => {
        if (policy.entries !== undefined) { 
            const entries: Entry[] = Object.entries(policy.entries).map<Entry>(([key, value]: [string,any]) => {
                let newSubjects: Subject[] = []
                let newResources: Resource[] = []
                if(value.subjects) {
                    newSubjects = Object.entries(value.subjects).map<Subject>(([key1, value1]: [string,any]) => {
                        const div: string[] = key1.split(":")
                        return {
                            subjectIssuer: div[0],
                            subject: div[1],
                            type: value1
                        }
                    })
                }
                if(value.resources) {
                    newResources = Object.entries(value.resources).map<Resource>(([key1, value1]: [string,any]) => {
                        const grant = JSON.stringify(value1.grant)
                        const revoke = JSON.stringify(value1.revoke)
                        return {
                            name: key1,
                            read: grant.includes("READ") && !revoke.includes("READ"),
                            write: grant.includes("WRITE") && !revoke.includes("WRITE"),
                            description: "",
                            erasable: !initResources.map((r: Resource) => r.name).includes(key1)
                        }
                    })
                }
                return {
                    name: key,
                    subjects: newSubjects,
                    resources : newResources
                }
            })
            setCurrentPolicy({...currentPolicy, policyId: policy.policyId})
            setEntries(entries)
        }
    }


// -----------------------------------------------------------------------------------------------
// UseEffect
// -----------------------------------------------------------------------------------------------

    useEffect(() => {
        if(id !== undefined && id !== '') {
            getPolicyByIdService(context, id).then((policy: Policy) => {
                setPolicy(policy)
            })
        }
    }, [id])
    

    useEffect(() => {
        let provEntries: any = {}
        entries.forEach((item) => {
            let provSubjects: any = {}
            let provResources: any = {}
            entry.subjects.forEach((item) => provSubjects[item.subjectIssuer + ":" + item.subject]={type : item.type})
            entry.resources.forEach((item) => {
                let grantList: any = []
                let revokeList: any = []

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


// -----------------------------------------------------------------------------------------------
// HandleOn
// -----------------------------------------------------------------------------------------------

    const handleOnSubmitEntry = (data: {name: string}) => {
        const idx = entries.findIndex((e: Entry) => e.name === entry.name)
        if(idx !== -1){
            let newEntries = [...entries]
            newEntries[idx] = entry
            setEntries([...newEntries])
        } else {
            setEntries([
                ...entries,
                entry
            ])
        }
    }

    const handleOnSubmitFinal = (data: {name: string}) => {
        try {
            setShowNotification({state: enumNotification.LOADING, title: ""})
            createOrUpdatePolicyService(context, currentPolicy).then(() => {
                //window.location.replace(path + "?tab=policies")
                console.log("Listo")
                setShowNotification(notificationSuccess)
            }).catch(() => {
                console.log("error-res")
                setShowNotification(notificationError)
            })
        } catch (e) {
            console.log("error-catch")
            setShowNotification(notificationError)
        }
    }

    const handleOnChangeInputName = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentPolicy({
            ...currentPolicy,
            policyId : event.target.value
        })
    }

    const handleOnChangeEntryName = (event: ChangeEvent<HTMLInputElement>) => {
        setEntry({
            ...entry,
            name: event.target.value
        })
    }

    const handleOnClickEditEntry = (entry: Entry) => {
        setEntry(entry)
    }


    useEffect(() => {
        console.log(showNotification)
    }, [showNotification])

// -----------------------------------------------------------------------------------------------
// HTML code
// -----------------------------------------------------------------------------------------------

    return (
        <Fragment>
            <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification}/>
            <h2>{(id) ? "Edit" : "Create new"} policy</h2>
            <div className="row">
                <div className="col-9">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal}>
                    {({register, errors}: FormAPI<{name: string}>) => {
                        return(
                            <FieldSet>
                                <Field label="Name" required={true}>
                                    <Input {...register("name")} type="text" disabled={id !== undefined} value={currentPolicy.policyId} onChange={handleOnChangeInputName}/>
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
                                renderItem={item => ListElement(item.name, entries, setEntries, [{key: "name", value: item.name}], false, () => handleOnClickEditEntry(item))}
                            />
                        </div>
                        <div className="col-9">
                            <Legend>Entry information</Legend>
                            <Form id="entryForm" onSubmit={handleOnSubmitEntry}>
                            {({register, errors}: FormAPI<{name: string}>) => {
                                return (
                                    <Field label="Name of entry">
                                        <Input {...register("name", { required : true })} type="text" form="entryForm" value={entry.name} onChange={handleOnChangeEntryName}/>
                                    </Field>
                                )    
                            }}
                            </Form>
                            <hr />
                            <FormSubjects subjects={entry.subjects} setSubjects={setSubjects}/>
                            <hr />
                            <FormResources resources={entry.resources} setResources={setResources} />
                            <hr />
                            <div className="d-flex justify-content-center">
                                <Button variant="secondary" form="entryForm" type="submit">Add or update entry</Button>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" className='mt-1' form="finalForm" type="submit">{(id) ? "Edit" : "Create"} policy</Button>
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
