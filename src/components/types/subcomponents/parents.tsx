import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from "@grafana/data"
import { StaticContext } from 'utils/context/staticContext'
import { getParentOfTypeService } from 'services/types/parent/getParentTypeService'
import { Button, Form, FormAPI, Icon, InlineLabel, Input, Select, useTheme2 } from '@grafana/ui'
import { getAllTypesService } from 'services/types/getAllTypesService'
import { SelectData } from 'utils/interfaces/select'
import { createOrUpdateTypeToBeChildService } from 'services/types/children/createOrUpdateTypeToBeChildService'
import { unlinkChildrenTypeById } from 'services/types/children/unlinkChildrenTypeByIdService'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { getAppEvents } from '@grafana/runtime'

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
    const [value, setValue] = useState<string>()
    const [types, setTypes] = useState<SelectData[]>([])
    const [selectedType, setSelectedType] = useState<SelectableValue<string>>()
    const [newParent, setNewParent] = useState<FormScheme>({ id: '', num: "1" })

    const context = useContext(StaticContext)
    const appEvents = getAppEvents()

    const handleOnSubmit = (data: FormScheme) => {
        createOrUpdateTypeToBeChildService(context, data.id, id, Number(data.num)).then(() => {
            console.log("OK")
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`The type ${id} has been edited correctly`],
            });
            getParents()
        }).catch(() => {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`The type ${id} has not been edited correctly, please check the data you have entered`],
            });
        }).finally(() => {
            setSelectedType({value: '', label: ''})
            setNewParent({ id: '', num: "1" })
        })
    }

    const handleUnlink = (parent: string) => {
        unlinkChildrenTypeById(context, parent, id).then(() => {
            console.log("OK")
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`The parent ${parent} has been unlinked correctly`],
            });
            getParents()
        }).catch(() => {
            console.log("error")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`The parent ${parent} has not been unlinked correctly`],
            });
        })

    }

    const handleOnChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnClickCheck = (parent: string) => {
        window.location.replace(path + "&mode=check&id=" + parent)
    }

    const handleOnChangeInputNum = (event: React.FormEvent<HTMLInputElement>, parent: string) => {
        let newParents = JSON.parse(JSON.stringify(parents))
        const idx: number = newParents.findIndex((v: FormScheme) => v.id === parent)
        newParents[idx] = {
            id: parent,
            num: event.currentTarget.value
        }
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
                    })
                    .sort((a: FormScheme, b: FormScheme) => a.id.localeCompare(b.id))
                )
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
        if (selectedType === undefined) {
            setNewParent({ id: '', num: "1" })
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
                    <div className='row mt-2'>
                        <div className="col-12 col-xl-5 mt-1">
                            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main }}>Parent</InlineLabel>
                                <Input {...register("id")} id={"input_id_" + pid} value={parent.id} readOnly={true} />
                            </div>
                        </div>
                        <div className="col-12 col-xl-3 mt-1">
                            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>Children number</InlineLabel>
                                <Input {...register("num")} id={"input_num_" + pid} type="text" value={parent.num} onChange={(e) => handleOnChangeInputNum(e, parent.id)} />
                            </div>
                        </div>
                        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type='submit' variant='secondary' style={{ marginRight: '5px', width: '100%', justifyContent: 'center' }}>Update</Button>
                            <Button type='button' variant='destructive' style={{ marginRight: '5px' }} onClick={() => handleUnlink(parent.id)}>Unlink</Button>
                            <Button type='button' variant='secondary' icon='external-link-alt' onClick={() => handleOnClickCheck(parent.id)}></Button>
                        </div>
                    </div>
                )
            }}
        </Form >
    })

    const noItems = <h5 style={{ textAlign: 'center', marginTop: '20px' }}>There are no parents</h5>

    const newParentForm = <div className='row mt-3'>
        <div className="col-12 col-xl-5 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main }}>Parent</InlineLabel>
                <Select
                    options={types}
                    value={selectedType}
                    onChange={(v) => setSelectedType(v)}
                />
            </div>
        </div>
        <div className="col-12 col-xl-3 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>Children number</InlineLabel>
                <Input type="number" value={newParent.num} onChange={(v) => setNewParent({ ...newParent, num: v.currentTarget.value })} />
            </div>
        </div>
        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='button' fullWidth onClick={() => { handleOnSubmit(newParent); setSelectedType(undefined) }} disabled={selectedType === undefined || (selectedType.value !== undefined && selectedType.value.trim()) === ''}>Add parent</Button>
        </div>
    </div>

    return <div>
        <div className='mb-1'>
            <Input
                value={value}
                prefix={<Icon name="search" />}
                onChange={handleOnChangeSearch}
                placeholder="Search"
            />
        </div>
        {newParentForm}
        {(parents.length > 0) ? parentsForm : noItems}
    </div>

}
