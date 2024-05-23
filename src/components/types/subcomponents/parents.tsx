import React, { useContext, useEffect, useState } from 'react'
import { AppPluginMeta, KeyValue, SelectableValue } from "@grafana/data"
import { StaticContext } from 'utils/context/staticContext'
import { getParentOfTypeService } from 'services/types/parent/getParentTypeService'
import { Button, Form, FormAPI, InlineField, InlineFieldRow, Input, Select, VerticalGroup } from '@grafana/ui'
import { getAllTypesService } from 'services/types/getAllTypesService'
import { SelectData } from 'utils/interfaces/select'
import { createOrUpdateTypeToBeChildService } from 'services/types/children/createOrUpdateTypeToBeChildService'
import { Notification } from 'utils/interfaces/notification'
import { enumNotification } from 'utils/auxFunctions/general'
import { CustomNotification } from 'components/auxiliary/general/notification'
import { unlinkChildrenTypeById } from 'services/types/children/unlinkChildrenTypeByIdService'
import { IDittoThing } from 'utils/interfaces/dittoThing'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

interface FormScheme {
    id: string
    num: string
}

export function ListParentsType({ path, id, meta }: Parameters) {

    const [parents, setParents] = useState<FormScheme[]>([])
    const [types, setTypes] = useState<SelectData[]>([])
    const [selectedType, setSelectedType] = useState<SelectableValue<string>>()
    const [newParent, setNewParent] = useState<FormScheme>({ id: '', num: "1" })
    const [showNotification, setShowNotification] = useState<Notification>({ state: enumNotification.HIDE, title: "" })

    const context = useContext(StaticContext)

    const notificationError: Notification = {
        state: enumNotification.ERROR,
        title: `The type ${id} has not been edited correctly.`,
        description: "Please check the data you have entered."
    }

    const notificationSuccess: Notification = {
        state: enumNotification.SUCCESS,
        title: `The type ${id} has been edited correctly.`,
        description: "You can leave the page if you don't want to edit any more."
    }

    const handleOnSubmit = (data: FormScheme) => {
        createOrUpdateTypeToBeChildService(context, data.id, id, Number(data.num)).then(() => {
            console.log("OK")
            setShowNotification(notificationSuccess)
            getParents()
        }).catch(() => {
            console.log("error")
            setShowNotification(notificationError)
        })
        
    }

    const handleUnlink = (parent: string) => {
        unlinkChildrenTypeById(context, parent, id).then(() => {
            console.log("OK")
            setShowNotification(notificationSuccess)
            getParents()
        }).catch(() => {
            console.log("error")
            setShowNotification(notificationError)
        })
        
    }

    const handleOnClickCheck = (parent: string) => {
        window.location.replace(path + "&mode=check&id=" + parent)
    }

    const handleOnChangeInputNum = (event: React.FormEvent<HTMLInputElement>, parent: string) => {
        let newParents = JSON.parse(JSON.stringify(parents))
        const idx: number = newParents.findIndex((v: FormScheme) => v.id === parent)
        console.log("idx: " + idx)
        newParents[idx] = {
            id: parent,
            num: event.currentTarget.value
        }
        console.log("parents: " + newParents)
        setParents(newParents)

    }

    const getParents = () => {
        getParentOfTypeService(context, id).then((res: any) => {
            if (res !== undefined) {
                setParents(Object.entries(res)
                    .map(([key, value]) => {
                        return {
                            id: key,
                            num: value as string
                        }
                    }))
            }
        }).catch(() => console.log("error"))
    }

    const getTypes = () => {
        getAllTypesService(context).then((res) => setTypes(
            res
                .filter((item: IDittoThing) => item.thingId !== id && !(parents.some(v => v.id === item.thingId)))
                .map((item: IDittoThing) => {
                    return {
                        label: item.thingId,
                        value: item.thingId
                    }
                })
        )).catch(() => console.log("error"))
    }

    useEffect(() => {
        getParents()
    }, [id])

    useEffect(() => {
        getTypes()
    }, [parents])

    useEffect(() => {
        console.log(showNotification)
    }, [showNotification])

    useEffect(() => {
        if(selectedType === undefined) {
            setNewParent({id: '', num: "1"})
        } else {
            setNewParent({
                ...newParent,
                id: (selectedType && selectedType.value) ? selectedType.value : ''
            })
        }
    }, [selectedType])

    const parentsForm = parents.map((parent: FormScheme, idx) => {
        const pid = parent.id.replace(":", "_")
        return <Form id={"form_" + pid} onSubmit={handleOnSubmit} maxWidth="none" style={{ marginTop: '0px', paddingTop: '0px' }}>
            {({ register, errors, control }: FormAPI<FormScheme>) => {
                return (
                    <InlineFieldRow>
                        <InlineField label="Parent">
                            <Input {...register("id")} id={"input_id_" + pid} value={parent.id} width={30} readOnly={true} />
                        </InlineField>
                        <InlineField label="Children number" style={{ marginLeft: '10px' }}>
                            <Input {...register("num")} id={"input_num_" + pid} type="text" value={parent.num} onChange={(e) => handleOnChangeInputNum(e, parent.id)} width={10}/>
                        </InlineField>
                        <Button type='button' variant='secondary' icon='external-link-alt' style={{ marginLeft: '10px' }} onClick={() => handleOnClickCheck(parent.id)}></Button>
                        <Button type='submit' variant='secondary' style={{ marginLeft: '10px', marginRight: '10px' }}>Update</Button>
                        <Button type='button' variant='destructive' onClick={() => handleUnlink(parent.id)}>Unlink</Button>
                    </InlineFieldRow>
                )
            }}
        </Form>
    })

    const noItems = <h5>There are no items</h5>

    const newParentForm = <InlineFieldRow>
        <InlineField label="Parent">
            <Select
                options={types}
                value={selectedType}
                onChange={(v) => setSelectedType(v)}
                width={30}
            />
        </InlineField>

        <InlineField label="Children number" style={{ marginLeft: '10px' }}>
            <Input type="number" value={newParent.num} onChange={(v) => setNewParent({ ...newParent, num: v.currentTarget.value })} width={10} />
        </InlineField>
        <Button type='button' onClick={() => {handleOnSubmit(newParent); setSelectedType(undefined)}} style={{ marginLeft: '10px', width: '210px', justifyContent: 'center' }}>Add parent</Button>
    </InlineFieldRow>

    return <VerticalGroup align="center">
        <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification} />
        {(parents.length > 0) ? parentsForm : noItems}
        {newParentForm}
    </VerticalGroup>

}
