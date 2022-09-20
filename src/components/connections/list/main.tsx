import { SelectableValue } from '@grafana/data'
import { Button, HorizontalGroup, Icon, LinkButton, Select, TextArea } from '@grafana/ui'
import { CustomNotification } from 'components/auxiliary/general/notification'
import React, { useState, useEffect, useContext, Fragment } from 'react'
import { closeConnectionService } from 'services/connections/closeConnectionService'
import { getAllConnectionIdsService } from 'services/connections/getAllConnectionsService'
import { getConnectionByIdService } from 'services/connections/getConnectionByIdService'
import { openConnectionService } from 'services/connections/openConnectionService'
import { enumNotification } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import { INotification } from 'utils/interfaces/notification'
import { ISelect } from 'utils/interfaces/select'

interface parameters {
    path : string
}

export const ListConnections = ({path} : parameters) => {

    const confirmDelete_title = "Delete connection"
    const confirmDelete_description = (id) => "Are you sure you want to delete connection " + id + "?"
    const confirmDelete_body = "This action cannot be undone."

    const [connections, setConnections] = useState<ISelect[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [selectedConnection, setselectedConnection] = useState<any>(undefined)
    const [showNotification, setShowNotification] = useState<INotification>({state: enumNotification.HIDE, title: ""})

    const context = useContext(StaticContext)

    const getConnectionById = (id:string) => {
        return getConnectionByIdService(context, id)
    }

    const updateConnections = () => {
        getAllConnectionIdsService(context).then((res:string[]) => {
            setConnections(res.map((id:string) => {
                return {
                    label : id,
                    value : id
                }
            }))
        }).catch(() => console.log("error"))
    }

    const handleOnClickStatusConnection = () => {
        if(value?.value && selectedConnection && selectedConnection.connectionStatus){
            setShowNotification({state: enumNotification.LOADING, title: ""})
            if(selectedConnection.connectionStatus.toLowerCase() == "closed"){
                openConnectionService(context, value.value).then(() => {
                    setShowNotification({
                        state: enumNotification.SUCCESS,
                        title: "Connection " + value.value + " opened correctly!"
                    })
                }).catch(() => {
                    setShowNotification({
                        state: enumNotification.ERROR,
                        title: "Error opening connection " + value.value
                    })
                })
            } else {
                closeConnectionService(context, value.value).then(() => {
                    setShowNotification({
                        state: enumNotification.SUCCESS,
                        title: "Connection " + value.value + " closed correctly!"
                    })
                }).catch(() => {
                    setShowNotification({
                        state: enumNotification.ERROR,
                        title: "Error closing connection " + value.value
                    })
                })
            }
        }
    }

    const handleOnClickEdit = () => {

    }

    const handleOnConfirmDelete = () => {
        if(value?.value !== undefined){
            setShowNotification({state: enumNotification.LOADING, title: ""})
            //DeleteFunction.then(() => {
                setShowNotification({
                    state: enumNotification.SUCCESS, 
                    title: "Connection successfully deleted!"
                })
            //}).catch...
            setValue(undefined)
            
        }
    }

    const handleOnClickDelete = () => {
        if(value?.value){
            setShowNotification({
                state: enumNotification.CONFIRM,
                title: confirmDelete_title,
                description: confirmDelete_description(value?.value),
                body: confirmDelete_body,
                onConfirmFunc: handleOnConfirmDelete,
                confirmText: "Delete",
                dismissText: "Cancel"
            })
        }
    }

    useEffect(() => {
        if(value && value.label){
            getConnectionById(value.label).then((item:any) => {
                setselectedConnection(item)
            }).catch(() => {
                setselectedConnection(undefined)
            })
        } else {
            setselectedConnection(undefined)
        }
    }, [value, showNotification])

    useEffect(() => {
    }, [selectedConnection])


    useEffect(() => {
        updateConnections()
    }, [])

    useEffect(() => {
        if(showNotification.state == enumNotification.HIDE){
            updateConnections()
        }
    }, [connections, showNotification])

    const isDisabled = !selectedConnection || showNotification.state !== enumNotification.HIDE

    const statusConnectionButton = (selectedConnection && selectedConnection.connectionStatus) ? 
        <HorizontalGroup justify="center">
            <Button variant="secondary" disabled={isDisabled || !selectedConnection.connectionStatus } onClick={handleOnClickStatusConnection} icon={(selectedConnection.connectionStatus.toLowerCase()  === "open") ? "lock" : "unlock"}>{
                (selectedConnection.connectionStatus.toLowerCase()  === "open") ? "Close" : "Open"
            }</Button>
            <Button variant="secondary" icon="pen" disabled={isDisabled} onClick={handleOnClickEdit}>Edit</Button>
            <Button variant="destructive" icon="trash-alt" disabled={isDisabled} onClick={handleOnClickDelete}>Delete</Button>
        </HorizontalGroup>
        : <div></div>

    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + "&mode=create"} className="m-3" disabled={true} icon="plus">
                    Create new connection
                </LinkButton>
            </HorizontalGroup>
            <div className='row justify-content-center mb-3'>
                <div className="col-12 col-sm-12 col-md-7 col-lg-7">
                    <Select
                        options={connections}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search"/>}
                        placeholder="Search"
                        disabled={showNotification.state !== enumNotification.HIDE}
                    />
                </div>
            </div>
            {statusConnectionButton}
            <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification}/>
            <TextArea className="mt-3" rows={25} value={(selectedConnection) ? JSON.stringify(selectedConnection, undefined, 4) : ""} readOnly/>
        </Fragment>
    )
}