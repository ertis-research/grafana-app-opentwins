import React, { useState, useEffect, Fragment, useContext, ChangeEvent } from 'react';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { LinkButton, Icon, ConfirmModal, Spinner, InlineSwitch, useTheme2, Input } from '@grafana/ui'
import { AppEvents, AppPluginMeta, KeyValue } from '@grafana/data';
import { defaultIfNoExist, enumNotification, imageIsUndefined } from 'utils/auxFunctions/general';
import { StaticContext } from 'utils/context/staticContext';
import { attributeSimulationOf } from 'utils/data/consts';
import { getAppEvents } from '@grafana/runtime';
import { getCurrentUserRole, isEditor, Roles } from 'utils/auxFunctions/auth';

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
    const [filteredThings, setFilteredThings] = useState<IDittoThing[]>([])
    const [value, setValue] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [showDeleteModal, setShowDeleteModal] = useState<string>()
    const [compactMode, setCompactMode] = useState<boolean>(iniCompactMode)
    const [noSimulations, setNoSimulations] = useState<boolean>(iniNoSimulations)
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)

    const context = useContext(StaticContext)
    const appEvents = getAppEvents()

    const title = (isType) ? "type" : "twin"
    const messageDelete = `Delete ${title}`
    const descriptionDelete = `Are you sure you want to remove the ${title} with id `
    const descriptionDeleteChildren = "Choose if you want to remove the twin alone, unlinking its children, or remove the twin and all its children."
    const messageSuccess = `The ${title} has been deleted correctly.`
    const messageError = `The ${title} has not been deleted correctly. Refresh the page or check for errors.`

    const deleteThing = (funcToExecute: any, context: any, thingId: string) => {
        setShowDeleteModal(undefined)
        setShowNotification(enumNotification.LOADING)
        funcToExecute(context, thingId).then(() => {
            console.log("OK")
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [messageSuccess]
            });
        }).catch(() => {
            console.log("error")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [messageError]
            });
        }).finally(() => {
            setShowNotification(enumNotification.HIDE)
        })

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
            setShowNotification(enumNotification.READY)
        }).catch(() => console.log("error"))
    }

    const updateFilteredThings = () => {
        const filterThings = (noSimulations) ? things.filter((item: any) => !item.hasOwnProperty("attributes") || !item.attributes.hasOwnProperty(attributeSimulationOf)) : things
        if (value === null || value === undefined) {
            setFilteredThings(filterThings)
        } else {
            setFilteredThings(filterThings.filter(thing => { return (value !== undefined) ? thing.thingId.includes(value) : true }))
        }
    }

    const handleOnChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnDelete = (e: any, thingId: string) => {
        e.preventDefault()
        setShowDeleteModal(thingId)
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        updateThings()
        getCurrentUserRole().then((role: string) => setUserRole(role))
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
    }, [showNotification, showDeleteModal])

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
            case enumNotification.LOADING:
                return (
                    <div className="mb-4 mt-4" style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Spinner inline={true} size={20} />
                    </div>
                )
            default:
                return <div></div>
        }
    }

    const numberChildren = (item: IDittoThing) => {
        if (isType && parentId !== undefined && item.attributes.hasOwnProperty("_parents") && item.attributes._parents.hasOwnProperty(parentId)) {
            return <div style={{ backgroundColor: useTheme2().colors.text.secondary, width: "100%", color: useTheme2().colors.background.primary, textAlign: 'end', paddingRight: '10px' }}>
                x{item.attributes._parents[parentId]}
            </div>
        }
        return <div></div>
    }

    const getCard = (item: IDittoThing) => {
        return <div className="p-4" style={{ height: "100%", width: "100%", backgroundColor: useTheme2().colors.background.canvas }}>
            <a href={path + "&mode=check&id=" + item.thingId}>
                <div style={{ height: (isEditor(userRole)) ? '85%' : '100%', width: "100%", overflow: "hidden", whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    <b>{defaultIfNoExist(item.attributes, "name", item.thingId).trim()}</b>
                    <p>{item.thingId}</p>
                    <p style={{ whiteSpace: 'normal' }}>{defaultIfNoExist(item.attributes, "description", "")}</p>
                </div>
                <div className='mt-2' style={{ height: '10%', display: (isEditor(userRole)) ? 'flex' : 'none', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <LinkButton fill='text' variant='secondary' hidden={!isEditor(userRole)} key="edit" icon="pen" tooltip="Edit" href={path + '&mode=edit&element=' + title + '&id=' + item.thingId} />
                    <LinkButton fill='text' variant='destructive' hidden={!isEditor(userRole)}key="delete" icon="trash-alt" tooltip="Delete" onClick={(e) => handleOnDelete(e, item.thingId)} />
                </div>
            </a>
        </div>
    }

    const fullCard = (item: IDittoThing) => {
        return <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3" key={item.thingId}>
            {numberChildren(item)}
            <div style={{ display: "block", width: "100%" }}>
                <div style={{ display: "inline-block", height: "200px", width: "35%", verticalAlign: "top" }}>
                    <a href={path + "&mode=check&id=" + item.thingId}>
                        <img src={imageIsUndefined(defaultIfNoExist(item.attributes, "image", undefined))} style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center" }} />
                    </a>
                </div>
                <div style={{ height: "200px", width: "65%", display: "inline-block", verticalAlign: "top" }}>
                    {getCard(item)}
                </div>
            </div>
        </div>
    }

    const compactCard = (item: IDittoThing) => {
        return <div className="col-6 col-sm-3 col-md-3 col-lg-2 mb-4" key={item.thingId}>
            <div style={{ display: "block", width: "100%", height: "100px" }}>
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

    const buttonAdd = <LinkButton icon="plus" hidden={!isEditor(userRole)} variant="primary" href={path + '&mode=create' + ((parentId !== undefined) ? '&id=' + parentId : "")}>
        Create new {title}
    </LinkButton>

    const noFilteredThings = (showNotification !== enumNotification.READY) ? <div></div> :
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
            <h5>There are no items which match the filters</h5>
        </div>

    const noThings = (showNotification !== enumNotification.READY) ? <div></div> :
        <div style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <h5>{(parentId !== undefined) ? ("This " + title + " has no children") : ("There are no " + title + "s")}</h5>
            {buttonAdd}
        </div>

    const listThing = <Fragment>
        <div className='row justify-content-between mb-3'>
            <div className="col-12 col-sm-12 col-md-12 col-lg-5 mb-1 mr-0">
                <Input
                    value={value}
                    prefix={<Icon name="search" />}
                    onChange={handleOnChangeSearch}
                    placeholder="Search"
                    style={{ width: '100%' }}
                />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 ml-0">
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <InlineSwitch value={compactMode} onChange={() => setCompactMode(!compactMode)} label="Compact view" showLabel={true} />
                    {switchSimulation}
                </div>
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-3 mb-1'>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {buttonAdd}
                </div>
            </div>
        </div>
        {notification()}
        <div className="row">
            {(filteredThings.length > 0) ? thingsMapped() : noFilteredThings}
        </div>
    </Fragment>

    return (things.length < 1) ? noThings : listThing
}
