import React, { useState, useEffect, Fragment, ChangeEvent } from 'react';
import { LinkData } from 'utils/interfaces/dittoThing';
import { LinkButton, Icon, Input, Button, Form, FormAPI, Select, InlineLabel, useTheme2 } from '@grafana/ui'
import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { enumNotification } from 'utils/auxFunctions/general';
import { SelectData } from 'utils/interfaces/select';
import { getAppEvents } from '@grafana/runtime';

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    id: string
    isType: boolean,
    labels: ListLabels,
    funcGet: () => Promise<LinkData[]>;
    funcUpdate: (elemToUpdate: string, newNum: number) => Promise<any>;
    funcUnlink: (elemToUnlink: string) => Promise<any>;
    funcGetOptions: () => Promise<string[]>;
    hrefCreateButton?: string
}

export interface ListLabels {
    id: string,
    number: string,
    buttonsText: string
}

export function ListThingNum({ path, id, meta, isType, labels, funcGet, funcUpdate, funcUnlink, funcGetOptions, hrefCreateButton }: Parameters) {

    const [things, setThings] = useState<LinkData[]>([])
    const [filteredThings, setFilteredThings] = useState<LinkData[]>([])
    const [value, setValue] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [selected, setSelected] = useState<SelectableValue<string>>()
    const [options, setOptions] = useState<SelectData[]>([])
    const [newLink, setNewLink] = useState<LinkData>({ id: '', num: 1 })

    const appEvents = getAppEvents()

    const cleanNewThing = () => {
        setSelected({value: '', label: ''})
        setNewLink({ id: '', num: 1 })
    }

    const getOptions = () => {
        funcGetOptions().then((res) => setOptions(
            res.filter((item: string) => item !== id && !(things.some(v => v.id === item)))
                .map((item: string) => {
                    return {
                        label: item,
                        value: item
                    }
                })
        )).catch(() => console.log("error"))
    }

    const handleUnlink = (elemToUnlink: string) => {
        setShowNotification(enumNotification.LOADING)
        funcUnlink(elemToUnlink).then(() => {
            console.log("OK")
            setTimeout(getThings,1500)
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`${elemToUnlink} has been unlinked correctly`],
            });
        }).catch(() => {
            console.log("error")
            getThings()
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`${elemToUnlink} has not been unlinked correctly`],
            });
        })

    }

    const getThings = () => {
        funcGet().then((res: LinkData[]) => {
            setThings(res)
        }).catch(() => {
            console.log("error")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`Error getting things`],
            });
        }).finally(() => setShowNotification(enumNotification.READY))
    }

    const updateFilteredThings = () => {
        const filterThings = (things !== undefined) ? things.sort((a: LinkData, b: LinkData) => a.id.localeCompare(b.id)) : things
        //const filterThings = (noSimulations) ? things.filter((item: any) => !item.hasOwnProperty("attributes") || !item.attributes.hasOwnProperty(attributeSimulationOf)) : things
        if (value === null || value === undefined) {
            setFilteredThings(filterThings)
        } else {
            setFilteredThings(filterThings.filter(thing => { return (value !== undefined) ? thing.id.includes(value) : true }))
        }
    }

    const handleOnSubmit = (data: LinkData) => {
        console.log("submit data", data)
        setShowNotification(enumNotification.LOADING)
        funcUpdate(data.id, Number(data.num)).then(() => {
            console.log("OK")
            setTimeout(getThings,1000)
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`${id} has been edited correctly`],
            });
        }).catch(() => {
            getThings()
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`${id} has not been edited correctly, please check the data you have entered`],
            });
        })

    }

    const handleOnChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnChangeInputNum = (event: React.FormEvent<HTMLInputElement>, thing: string) => {
        let newThings = JSON.parse(JSON.stringify(things))
        const idx: number = newThings.findIndex((v: LinkData) => v.id === thing)
        newThings[idx] = {
            id: thing,
            num: event.currentTarget.value
        }
        setThings(newThings)
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getThings()
    }, [])

    useEffect(() => {
        console.log("useEffect things")
        updateFilteredThings()
        getOptions()
    }, [things, value])

    useEffect(() => {
        if (selected === undefined) {
            setNewLink({ id: '', num: 1 })
        } else {
            setNewLink({
                ...newLink,
                id: (selected && selected.value) ? selected.value : ''
            })
        }
    }, [selected])

    const childrenMapped = filteredThings.map((thing: LinkData, idx) => {
        const pid = thing.id.replace(":", "_")
        return <Form id={"form_" + pid} onSubmit={handleOnSubmit} maxWidth="none" style={{ marginTop: '0px', paddingTop: '0px' }}>
            {({ register, errors, control }: FormAPI<LinkData>) => {
                return (
                    <div className='row mt-2'>
                        <div className="col-12 col-xl-5 mt-1">
                            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main }}>{labels.id}</InlineLabel>
                                <Input {...register("id")} id={"input_id_" + pid} value={thing.id} readOnly={true}/>
                            </div>
                        </div>
                        <div className="col-12 col-xl-3 mt-1">
                            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>{labels.number}</InlineLabel>
                                <Input {...register("num")} id={"input_num_" + pid} type="text" value={thing.num} onChange={(e) => handleOnChangeInputNum(e, thing.id)} disabled={showNotification === enumNotification.LOADING}/>
                            </div>
                        </div>
                        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type='submit' variant='secondary' style={{ marginRight: '5px', width: '100%', justifyContent: 'center' }} disabled={showNotification === enumNotification.LOADING}>Update</Button>
                            <Button type='button' variant='destructive' style={{ marginRight: '5px' }} onClick={() => handleUnlink(thing.id)} disabled={showNotification === enumNotification.LOADING}>Unlink</Button>
                            <LinkButton type='button' variant='secondary' icon='external-link-alt' href={path + "&mode=check&section=information&id=" + thing.id} disabled={showNotification === enumNotification.LOADING}></LinkButton>
                        </div>
                    </div>
                )
            }}
        </Form>
    })

    const newChildForm = <div className='row mt-3'>
        <div className="col-12 col-xl-5 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main }}>{labels.id}</InlineLabel>
                <Select
                    options={options}
                    value={selected}
                    onChange={(v) => setSelected(v)}
                    disabled={showNotification === enumNotification.LOADING}
                />
            </div>
        </div>
        <div className="col-12 col-xl-3 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: useTheme2().colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>{labels.number}</InlineLabel>
                <Input type="number" value={newLink.num} onChange={(v) => setNewLink({ ...newLink, num: Number(v.currentTarget.value) })} disabled={showNotification === enumNotification.LOADING} />
            </div>
        </div>
        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='button' fullWidth onClick={() => {handleOnSubmit(newLink); cleanNewThing()}} disabled={showNotification === enumNotification.LOADING || selected === undefined || (selected.value !== undefined && selected.value.trim()) === ''}>Add {labels.buttonsText}</Button>
        </div>
    </div>

    const noChildren = (things.length < 1) ? <div></div> :
        <h5 style={{ textAlign: 'center', marginTop: '20px' }}>There are no items</h5>

    const createButton = (hrefCreateButton === undefined) ? <div></div>
        : <LinkButton icon="plus" variant="primary" href={hrefCreateButton}>
            Create new {labels.buttonsText}
        </LinkButton>

    return (
        <Fragment>
            <div className={(hrefCreateButton !== undefined) ? "searchAndButton" : ""}>
                <div style={{ width: '100%', marginRight: '5px' }}>
                    <Input
                        value={value}
                        prefix={<Icon name="search" />}
                        onChange={handleOnChangeSearch}
                        placeholder="Search"
                    />
                </div>
                {createButton}
            </div>
            {newChildForm}
            <div className="row">
                {(filteredThings.length > 0) ? childrenMapped : noChildren}
            </div>
        </Fragment>
    );
}
