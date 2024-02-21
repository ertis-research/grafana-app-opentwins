import React, { useState, useEffect, Fragment, useContext } from 'react';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { Card, LinkButton, IconButton, Select, Icon, ConfirmModal, Modal, Spinner, VerticalGroup, InlineSwitch, InlineFieldRow, useTheme2 } from '@grafana/ui'
import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { defaultIfNoExist, enumNotification, imageIsUndefined } from 'utils/auxFunctions/general';
import { ISelect } from 'utils/interfaces/select';
import { StaticContext } from 'utils/context/staticContext';
import { attributeSimulationOf } from 'utils/data/consts';

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    isType: boolean
    funcThings: any
    funcDelete: any
    funcDeleteChildren?: any
    parentId?: string
    iniCompactMode?: boolean
    iniNoSimulations?: boolean
}

export function MainList({ path, meta, isType, funcThings, funcDelete, funcDeleteChildren, parentId, iniCompactMode = false, iniNoSimulations = false }: Parameters) {

    const [things, setThings] = useState<IDittoThing[]>([])
    const [values, setValues] = useState<ISelect[]>([])
    const [filteredThings, setFilteredThings] = useState<IDittoThing[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [showDeleteModal, setShowDeleteModal] = useState<string>()
    const [compactMode, setCompactMode] = useState<boolean>(iniCompactMode)
    const [noSimulations, setNoSimulations] = useState<boolean>(iniNoSimulations)

    const context = useContext(StaticContext)

    const title = (isType) ? "type" : "twin"
    const messageDelete = `Delete ${title}`
    const descriptionDelete = `Are you sure you want to remove the ${title} with id `
    const descriptionDeleteChildren = "Choose if you want to remove the twin alone, unlinking its children, or remove the twin and all its children."
    const messageSuccess = `The ${title} has been deleted correctly.`
    const messageError = `The ${title} has not been deleted correctly.`
    const descriptionError = "Refresh the page or check for errors."

    const notification = () => {
        if (showDeleteModal !== undefined) {
            const thingId = showDeleteModal
            if (!isType && funcDeleteChildren !== undefined) {
                return <ConfirmModal isOpen={true} title={messageDelete} body={descriptionDelete + `${thingId}?`} description={descriptionDeleteChildren} confirmationText={thingId} confirmText={"With children"} alternativeText={"Without children"} dismissText={"Cancel"} onAlternative={() => deleteThing(funcDelete, context, thingId)} onDismiss={hideNotification} onConfirm={() => deleteThing(funcDeleteChildren, context, thingId)} />
            } else {
                return <ConfirmModal isOpen={true} title={messageDelete} body={descriptionDelete + `${thingId}?`} confirmText={"Delete"} onConfirm={() => deleteThing(funcDelete, context, thingId)} onDismiss={hideNotification} />
            }
        }
        switch (showNotification) {
            case enumNotification.SUCCESS:
                return <Modal title={messageSuccess} icon='check' isOpen={true} onDismiss={hideNotification} />
            case enumNotification.ERROR:
                return <Modal title={messageError} icon='exclamation-triangle' isOpen={true} onDismiss={hideNotification}>{descriptionError}</Modal>
            case enumNotification.LOADING:
                return (
                    <VerticalGroup align="center">
                        <h4 className="mb-0 mt-4">Loading...</h4>
                        <Spinner size={30} />
                    </VerticalGroup>
                )
            default:
                return <div></div>
        }
    }

    const deleteThing = (funcToExecute: any, context: any, thingId: string) => {
        setShowDeleteModal(undefined)
        setShowNotification(enumNotification.LOADING)
        try {
            funcToExecute(context, thingId).then(() => {
                console.log("OK")
                setShowNotification(enumNotification.SUCCESS)
            }).catch(() => {
                console.log("error")
                setShowNotification(enumNotification.ERROR)
            })
        } catch (e) {
            console.log("error")
            setShowNotification(enumNotification.ERROR)
            updateThings()
        }

    }

    const hideNotification = () => {
        setShowDeleteModal(undefined)
        setShowNotification(enumNotification.HIDE)
    }

    const updateThings = () => {
        setShowNotification(enumNotification.LOADING)
        funcThings().then((res: any) => {
            if (res.hasOwnProperty("items")) { res = res.items }
            setThings(res)
            if (res !== undefined) {
                setValues(res.map((item: IDittoThing) => {
                    return {
                        label: item.thingId,
                        value: item.thingId
                    }
                }))
            }
            setShowNotification(enumNotification.READY)
        }).catch(() => console.log("error"))
    }

    const updateFilteredThings = () => {
        const filterThings = (noSimulations) ? things.filter((item: any) => !item.hasOwnProperty("attributes") || !item.attributes.hasOwnProperty(attributeSimulationOf)) : things
        if (value === null || value === undefined) {
            setFilteredThings(filterThings)
        } else {
            setFilteredThings(filterThings.filter(thing => { return (value.value !== undefined) ? thing.thingId.includes(value.value) : true }))
        }
    }

    const handleOnDelete = (e: any, thingId: string) => {
        e.preventDefault()
        setShowDeleteModal(thingId)
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        updateThings()
    }, [])

    useEffect(() => {
        updateFilteredThings()
    }, [things])

    useEffect(() => {
        if (showNotification === enumNotification.HIDE) {
            updateThings()
        }
    }, [showNotification, showDeleteModal])

    useEffect(() => {
        updateThings()
    }, [noSimulations])

    useEffect(() => {
    }, [parentId])

    useEffect(() => {
        updateFilteredThings()
    }, [value, things])

    useEffect(() => {
    }, [values, showNotification, showDeleteModal])

    const numberChildren = (item: IDittoThing) => {
        console.log("Child", item)
        if (isType && parentId !== undefined && item.attributes.hasOwnProperty("_parents") && item.attributes._parents.hasOwnProperty(parentId)) {
            return <div style={{ backgroundColor: useTheme2().colors.text.secondary, width: "100%", color: useTheme2().colors.background.primary, textAlign: 'end', paddingRight: '10px' }}>
                x{item.attributes._parents[parentId]}
            </div>
        }
        return <div></div>
    }

    const getCard = (item: IDittoThing) => {
        return <Card href={path + "&mode=check&id=" + item.thingId} style={{ height: "100%" }}>
            <Card.Heading >{defaultIfNoExist(item.attributes, "name", item.thingId)} </Card.Heading>
            <Card.Meta>
                <div>
                    <p>{item.thingId}</p>
                    <p style={{ maxWidth: "100%", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {defaultIfNoExist(item.attributes, "description", "")}
                    </p>
                </div>
            </Card.Meta>
            <Card.SecondaryActions>
                <a href={path + '&mode=edit&element=' + title + '&id=' + item.thingId} style={{ all: 'unset' }}>
                    <IconButton key="edit" name="pen" tooltip="Edit" />
                </a>
                <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={(e) => handleOnDelete(e, item.thingId)} />
            </Card.SecondaryActions>
        </Card>
    }

    const fullCard = (item: IDittoThing) => {
        return <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-3" key={item.thingId}>
            {numberChildren(item)}
            <div style={{ display: "block", width: "100%" }}>
                <div style={{ display: "inline-block", height: "180px", width: "35%", verticalAlign: "top" }}>
                    <a href={path + "&mode=check&id=" + item.thingId}>
                        <img src={imageIsUndefined(defaultIfNoExist(item.attributes, "image", undefined))} style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center" }} />
                    </a>
                </div>
                <div style={{ height: "180px", width: "65%", display: "inline-block", verticalAlign: "top" }}>
                    {getCard(item)}
                </div>
            </div>
        </div>
    }

    const compactCard = (item: IDittoThing) => {
        return <div className="col-6 col-sm-3 col-md-3 col-lg-2 mb-2" key={item.thingId}>
            <div style={{ display: "block", width: "100%" }}>
                {getCard(item)}
            </div>
        </div>
    }

    const thingsMapped = () => {
        const typeOfCard = (compactMode) ? compactCard : fullCard
        return filteredThings.map((item: IDittoThing) => typeOfCard(item))
    }

    const switchSimulation = (!things.some((item: any) => item.hasOwnProperty("attributes") && item.attributes.hasOwnProperty(attributeSimulationOf))) ? <div></div> :
        <InlineSwitch value={!noSimulations} onChange={() => setNoSimulations(!noSimulations)} label="Show simulated twins" showLabel={true} />

    const noChildren = (showNotification !== enumNotification.READY) ? <div></div> :
        <VerticalGroup align="center">
            <h5>There are no items</h5>
        </VerticalGroup>

    return (
        <Fragment>
            <div className='row justify-content-between mb-3'>
                <div className='col-12 col-sm-12 col-md-3 col-lg-3 mb-1'>
                    <LinkButton icon="plus" variant="primary" href={path + '&mode=create' + ((parentId !== undefined) ? '&id=' + parentId : "")}>
                        Create new {title}
                    </LinkButton>
                </div>
                <div className="col-12 col-sm-12 col-md-5 col-lg-5 mb-1">
                    <Select
                        options={values}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search" />}
                        onInputChange={(v, action) => {
                            if (action.action === 'set-value' || action.action === 'input-change') {
                                setValue({
                                    label: v,
                                    value: v
                                })
                            }
                        }
                        }
                        placeholder="Search"
                    />
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-1">
                    <VerticalGroup align="flex-end">
                        <InlineFieldRow>
                            {switchSimulation}
                            <InlineSwitch value={compactMode} onChange={() => setCompactMode(!compactMode)} label="Compact view" showLabel={true} />
                        </InlineFieldRow>
                    </VerticalGroup>
                </div>
            </div>
            {notification()}
            <div className="row">
                {(filteredThings.length > 0) ? thingsMapped() : noChildren}
            </div>
        </Fragment>
    );
}
