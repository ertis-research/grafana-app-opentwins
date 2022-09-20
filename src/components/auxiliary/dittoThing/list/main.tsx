import React, { useState, useEffect, Fragment, useContext } from 'react';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { Card, LinkButton, IconButton, HorizontalGroup, Select, Icon, ConfirmModal, Modal, Spinner, VerticalGroup } from '@grafana/ui'
import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { defaultIfNoExist, enumNotification, imageIsUndefined } from 'utils/auxFunctions/general';
import { ISelect } from 'utils/interfaces/select';
import { StaticContext } from 'utils/context/staticContext';

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
    isType : boolean
    funcThings : any
    funcDelete : any
    funcDeleteChildren ?: any
    parentId ?: string
}

export function MainList({path, meta, isType, funcThings, funcDelete, funcDeleteChildren, parentId } : parameters) {

    const [things, setThings] = useState<IDittoThing[]>([])
    const [values, setValues] = useState<ISelect[]>([])
    const [filteredThings, setFilteredThings] = useState<IDittoThing[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [showDeleteModal, setShowDeleteModal] = useState<string>()
 
    const context = useContext(StaticContext)

    const title = (isType) ? "type" : "twin"
    const messageDelete = `Delete ${title}`
    const descriptionDelete = `Are you sure you want to remove the ${title} with id `
    const descriptionDeleteChildren = "Choose if you want to remove the twin alone, unlinking its children, or remove the twin and all its children."
    const messageSuccess = `The ${title} has been deleted correctly.`
    const messageError = `The ${title} has not been deleted correctly.`
    const descriptionError = "Refresh the page or check for errors."

    const notification = () => {
        if(showDeleteModal !== undefined){
            const thingId = showDeleteModal
            if(!isType && funcDeleteChildren !== undefined){
                return <ConfirmModal isOpen={true} title={messageDelete} body={descriptionDelete + `${thingId}?`} description={descriptionDeleteChildren} confirmationText={thingId} confirmText={"With children"} alternativeText={"Without children"} dismissText={"Cancel"} onAlternative={() => deleteThing(funcDelete, context, thingId)} onDismiss={hideNotification} onConfirm={() => deleteThing(funcDeleteChildren, context, thingId)} /> 
            } else {
                return <ConfirmModal isOpen={true} title={messageDelete} body={descriptionDelete + `${thingId}?`} confirmText={"Delete"} onConfirm={() => deleteThing(funcDelete, context, thingId)} onDismiss={hideNotification} /> 
            }
        }
        switch(showNotification) {
            case enumNotification.SUCCESS:
                return <Modal title={messageSuccess} icon='check' isOpen={true} onDismiss={hideNotification}/>
            case enumNotification.ERROR:
                return <Modal title={messageError} icon='exclamation-triangle' isOpen={true} onDismiss={hideNotification}>{descriptionError}</Modal>
            case enumNotification.LOADING:
                return (
                    <VerticalGroup align="center">
                        <h4 className="mb-0 mt-4">Loading...</h4>
                        <Spinner size={30}/> 
                    </VerticalGroup>
                )
            default:
                return <div></div>
        }
    }

    const deleteThing = (funcToExecute:any, context:any, thingId:string) => {
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
        funcThings().then((res:any) => {
            if (res.hasOwnProperty("items")) res = res.items
            setThings(res)
            console.log(things)
            if(res !== undefined){
                setValues(res.map((item:IDittoThing) => {
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
        console.log("FILTERED")
        console.log(filteredThings)
        if (value == null || value == undefined) {
            setFilteredThings(things)
        } else {
            setFilteredThings(things.filter(thing => {return (value.value != undefined) ? thing.thingId.includes(value.value) : true}))
        }
    }

    const handleOnDelete = (e:any, thingId:string) => {
        e.preventDefault()
        setShowDeleteModal(thingId)
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        console.log("HOLA")
        updateThings()
    }, [])

    useEffect(() => {
        updateFilteredThings()
    }, [things])

    useEffect(() => {
        if(showNotification == enumNotification.HIDE) {
            updateThings()
        }
    }, [showNotification, showDeleteModal])

    useEffect(() => {
    }, [parentId])


    useEffect(() => {
        console.log("CAMBIO DE VALUE")
        console.log(value)
        updateFilteredThings()
    }, [value, things])

    useEffect(() => {
    }, [values, showNotification, showDeleteModal])

    const thingsMapped = filteredThings.map((item) =>
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={item.thingId}>
            <div style={{display: "block", width: "100%"}}>
                <div style={{display: "inline-block", height: "180px", width:"35%", verticalAlign: "top"}}>
                    <a href={path + "&mode=check&id=" + item.thingId}>
                        <img src={imageIsUndefined(defaultIfNoExist(item.attributes, "image", undefined))} style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center"}}/>
                    </a>
                </div>
                <div style={{height: "180px", width:"65%", display: "inline-block", verticalAlign: "top"}}>
                    <Card 
                        heading={defaultIfNoExist(item.attributes, "name", item.thingId)} 
                        href={path + "&mode=check&id=" + item.thingId}
                        style={{height: "100%"}}>
                        <Card.Meta>
                            <div>
                                <p>{item.thingId}</p>
                                <p style={{maxWidth: "100%", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                    {defaultIfNoExist(item.attributes, "description", "")}
                                </p>
                            </div>
                        </Card.Meta>
                        <Card.SecondaryActions>
                            <IconButton key="edit" name="pen" tooltip="Edit" />
                            <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={(e) => handleOnDelete(e, item.thingId)}/>
                        </Card.SecondaryActions>
                    </Card>
                </div>
            </div>
        </div>
    );

    const noChildren = (showNotification != enumNotification.READY) ? <div></div> :  
        <VerticalGroup align="center">
            <h5>This twin has no children</h5>
        </VerticalGroup>

    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + '&mode=create' + ((parentId !== undefined) ? '&id='+ parentId : "")} className="m-3">
                    Create new {title}
                </LinkButton>
            </HorizontalGroup>
            <div className='row justify-content-center mb-3'>
                <div className="col-12 col-sm-12 col-md-7 col-lg-7">
                    <Select
                        options={values}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search"/>}
                        onInputChange={(v, action) => {
                            if(action.action == 'set-value' || action.action == 'input-change')
                            setValue({
                                label: v,
                                value: v
                            })}
                        }
                        placeholder="Search"
                    />
                </div>
            </div>
            {notification()}
            <div className="row">
                {(filteredThings.length > 0) ? thingsMapped : noChildren}
            </div>
        </Fragment>
    );
}