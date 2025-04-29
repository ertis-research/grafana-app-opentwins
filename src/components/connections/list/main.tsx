import { AppEvents, SelectableValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Button, Icon, LinkButton, Select, TextArea } from '@grafana/ui'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { closeConnectionService } from 'services/connections/closeConnectionService'
import { deleteConnectionByIdService } from 'services/connections/deleteConnectionByIdService'
import { getAllConnectionIdsService } from 'services/connections/getAllConnectionsService'
import { openConnectionService } from 'services/connections/openConnectionService'
import { getCurrentUserRole, hasAuth, Roles } from 'utils/auxFunctions/auth'
import { StaticContext } from 'utils/context/staticContext'
import { SelectData } from 'utils/interfaces/select'

interface Parameters {
    path: string
}

export const ListConnections = ({ path }: Parameters) => {

    const context = useContext(StaticContext)
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)
    const [connections, setConnections] = useState<SelectData[]>([])
    const [selected, setSelected] = useState<SelectableValue<any>>()
    const appEvents = getAppEvents()

    useEffect(() => {
        updateConnections()
        getCurrentUserRole().then((role: string) => setUserRole(role))
    }, [])

    useEffect(() => {
        if(selected && selected.value && selected.value.hasOwnProperty("id")){
            const refreshSelected = connections.find(v => v.label === selected.value.id)
            setSelected(refreshSelected)
        }
    }, [connections])

    const updateConnections = () => {
        getAllConnectionIdsService(context).then((res: any[]) => {
            setConnections(res.map((ar: any) => {
                return {
                    label: ar.name,
                    value: ar
                }
            }))
        }).catch(() => {
            console.log("error")
        })
    }

    const handleOnClickDelete = () => {
        if (selected !== undefined && selected.value) {
            deleteConnectionByIdService(context, selected.value)
        }
    }

    const handleOnClickStatusConnection = () => {
        if(selected && selected.value && selected.value.hasOwnProperty("id") && selected.value.hasOwnProperty("connectionStatus")){
            const selectedConnection = selected.value
            if(selectedConnection.connectionStatus.toLowerCase() === "closed"){
                openConnectionService(context, selected.value.id).then(() => {
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: ["Connection " + selected.value.id + " opened correctly!"]
                    });
                updateConnections()
                }).catch((e) => {
                    console.log(e)
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: ["Error opening connection " + selected.value.id + ": " + e.message]
                    });
                })
            } else {
                closeConnectionService(context, selected.value.id).then(() => {
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: ["Connection " + selected.value.id + " closed correctly!"]
                    });
                    updateConnections()
                }).catch((e) => {
                    console.log(e)
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: ["Error closing connection " + selected.value.id + ": " + e.message]
                    });
                })
            }
        }
    }

    const closeOpenButton = (connection: any) => <Button style={{ marginRight: '10px' }} variant="secondary" onClick={handleOnClickStatusConnection} icon={(connection.connectionStatus.toLowerCase()  === "open") ? "lock" : "unlock"}>
        {
            (connection.connectionStatus.toLowerCase()  === "open") ? "Close" : "Open"
        }
    </Button>

    const buttons = (selected !== undefined) ?
        <div style={{ display: 'flex', justifyItems: 'flex-start', justifyContent: 'flex-start' }}>
            {(selected.value && selected.value.hasOwnProperty("connectionStatus")) ? closeOpenButton(selected.value) : <div></div> }
            <Button variant="destructive" icon="trash-alt" onClick={handleOnClickDelete}>Delete</Button>
        </div>
        : <div></div>
    //            <LinkButton variant="secondary" href={path + "&id=" + value.value + "&mode=edit"} icon="pen" disabled={showNotification.state !== enumNotification.READY}>Edit</LinkButton>


    const createButton = <div style={{ display: 'flex', alignItems: 'center' }}>
        <LinkButton variant="primary" href={path + "&mode=create"} icon="plus">
            Create new connection
        </LinkButton>
    </div>

    const component = <Fragment>
        <div className='row justify-content-between mb-3'>
            <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                <Select
                    options={connections}
                    value={selected}
                    onChange={v => setSelected(v)}
                    prefix={<Icon name="search" />}
                    placeholder="Search"
                />
            </div>
            <div className='col-12 col-sm-12 col-md-4 col-lg-4' >
                {buttons}
            </div>
            <div className='col-12 col-sm-12 col-md-3 col-lg-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {createButton}
            </div>
        </div>
        {(selected !== undefined) ? <TextArea className="mt-3" rows={25} value={(selected) ? JSON.stringify(selected, undefined, 4) : ""} readOnly /> : <div></div>}
    </Fragment>

    const noAllow = <div style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <h5>You do not have sufficient permissions to access this content</h5>
    </div>

    return (hasAuth(userRole, Roles.EDITOR)) ? component : noAllow

}
