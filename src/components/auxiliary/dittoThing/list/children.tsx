import React, { useState, useEffect, Fragment, useContext, ChangeEvent } from 'react';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { LinkButton, Icon, Input, Button, Form, FormAPI, Select, InlineLabel, useTheme2 } from '@grafana/ui'
import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { enumNotification } from 'utils/auxFunctions/general';
import { SelectData } from 'utils/interfaces/select';
import { StaticContext } from 'utils/context/staticContext';
import { getChildrenOfTypeService } from 'services/types/children/getChildrenOfTypeService';
import { getAllTypesService } from 'services/types/getAllTypesService';
import { getAppEvents } from '@grafana/runtime';
import { unlinkChildrenTypeById } from 'services/types/children/unlinkChildrenTypeByIdService';
import { createOrUpdateTypeToBeChildService } from 'services/types/children/createOrUpdateTypeToBeChildService';

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    id: string
    isType: boolean
}

interface NewLinkChild {
    id: string,
    num: number
}

export function ListChildren({ path, id, meta, isType }: Parameters) {

    const [children, setChildren] = useState<IDittoThing[]>([])
    const [filteredChildren, setFilteredThings] = useState<IDittoThing[]>([])
    const [value, setValue] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [selectedType, setSelectedType] = useState<SelectableValue<string>>()
    const [types, setTypes] = useState<SelectData[]>([])
    const [newChild, setNewChild] = useState<NewLinkChild>({ id: '', num: 1 })


    const context = useContext(StaticContext)
    const appEvents = getAppEvents()

    const getTypes = () => {
        getAllTypesService(context).then((res) => setTypes(
            res.filter((item: IDittoThing) => item.thingId !== id && !(children.some(v => v.thingId === item.thingId)))
                .map((item: IDittoThing) => {
                    return {
                        label: item.thingId,
                        value: item.thingId
                    }
                })
        )).catch(() => console.log("error"))
    }

    const handleUnlink = (child: string) => {
        unlinkChildrenTypeById(context, id, child).then(() => {
            console.log("OK")
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`The child ${child} has been unlinked correctly`],
            });
            getChildren()
        }).catch(() => {
            console.log("error")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`The child ${child} has not been unlinked correctly`],
            });
        })

    }

    const getChildren = () => {
        setShowNotification(enumNotification.LOADING)
        getChildrenOfTypeService(context, id).then((res: any) => {
            if (res.hasOwnProperty("items")) { res = res.items }
            setChildren(res)
            setShowNotification(enumNotification.READY)
        }).catch(() => console.log("error"))
    }

    const updateFilteredThings = () => {
        const filterThings = children.sort((a: IDittoThing, b: IDittoThing) => a.thingId.localeCompare(b.thingId))
        //const filterThings = (noSimulations) ? things.filter((item: any) => !item.hasOwnProperty("attributes") || !item.attributes.hasOwnProperty(attributeSimulationOf)) : things
        if (value === null || value === undefined) {
            setFilteredThings(filterThings)
        } else {
            setFilteredThings(filterThings.filter(thing => { return (value !== undefined) ? thing.thingId.includes(value) : true }))
        }
    }

    const handleOnChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnClickCheck = (child: string) => {
        window.location.replace(path + "&mode=check&id=" + child)
    }

    const handleOnChangeInputNum = (event: React.FormEvent<HTMLInputElement>, child: string) => {
        let newChildren: IDittoThing[] = JSON.parse(JSON.stringify(children))
        const idx: number = newChildren.findIndex((v: IDittoThing) => v.thingId === child)
        const oldChild: IDittoThing = newChildren[idx]
        newChildren[idx] = {
            ...oldChild,
            attributes: {
                ...oldChild.attributes,
                _parents: {
                    ...oldChild.attributes._parents,
                    [id]: event.currentTarget.value
                }
            }
        }
        setChildren(newChildren)
    }

    const handleOnSubmit = (data: NewLinkChild) => {
        createOrUpdateTypeToBeChildService(context, id, data.id, Number(data.num)).then(() => {
            console.log("OK")
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`The type ${id} has been edited correctly`],
            });
        }).catch(() => {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`The type ${id} has not been edited correctly, please check the data you have entered`],
            });
        }).finally(() => {
            getChildren()
        })

    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getChildren()
    }, [])

    useEffect(() => {
        updateFilteredThings()
        getTypes()
    }, [children, value])

    const childrenMapped = filteredChildren.map((child: IDittoThing, idx) => {
        const pid = child.thingId.replace(":", "_")
        return <Form id={"form_" + pid} onSubmit={handleOnSubmit} maxWidth="none" style={{ marginTop: '0px', paddingTop: '0px' }}>
            {({ register, errors, control }: FormAPI<NewLinkChild>) => {
                return (
                    <div className='row mt-2'>
                        <div className="col-12 col-xl-5 mt-1">
                            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main }}>Child</InlineLabel>
                                <Input {...register("id")} id={"input_id_" + pid} value={child.thingId} readOnly={true} />
                            </div>
                        </div>
                        <div className="col-12 col-xl-3 mt-1">
                            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>Number</InlineLabel>
                                <Input {...register("num")} id={"input_num_" + pid} type="text" value={child.attributes._parents[id]} onChange={(e) => handleOnChangeInputNum(e, child.thingId)} />
                            </div>
                        </div>
                        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type='submit' variant='secondary' style={{ marginRight: '5px', width: '100%', justifyContent: 'center' }}>Update</Button>
                            <Button type='button' variant='destructive' style={{ marginRight: '5px' }} onClick={() => handleUnlink(child.thingId)}>Unlink</Button>
                            <Button type='button' variant='secondary' icon='external-link-alt' onClick={() => handleOnClickCheck(child.thingId)}></Button>
                        </div>
                    </div>
                )
            }}
        </Form>
    })

    const newChildForm = <div className='row mt-3'>
        <div className="col-12 col-xl-5 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main }}>Child</InlineLabel>
                <Select
                    options={types}
                    value={selectedType}
                    onChange={(v) => setSelectedType(v)}
                />
            </div>
        </div>
        <div className="col-12 col-xl-3 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>Number</InlineLabel>
                <Input type="number" value={newChild.num} onChange={(v) => setNewChild({ ...newChild, num: Number(v.currentTarget.value) })} />
            </div>
        </div>
        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='button' fullWidth onClick={() => { handleOnSubmit(newChild); setSelectedType(undefined) }}>Add child</Button>
        </div>
    </div>

    const noChildren = (showNotification !== enumNotification.READY) ? <div></div> :
        <h5 style={{ textAlign: 'center', marginTop: '20px' }}>There are no children</h5>

    return (
        <Fragment>
            <div className="searchAndButton">
                <div style={{ width: '100%', marginRight: '5px' }}>
                    <Input
                        value={value}
                        prefix={<Icon name="search" />}
                        onChange={handleOnChangeSearch}
                        placeholder="Search"
                    />
                </div>
                <LinkButton icon="plus" variant="primary" href={path + '&mode=create' + ((id !== undefined) ? '&id=' + id : "")}>
                    Create new child
                </LinkButton>
            </div>
            {newChildForm}
            <div className="row">
                {(filteredChildren.length > 0) ? childrenMapped : noChildren}
            </div>
        </Fragment>
    );
}
