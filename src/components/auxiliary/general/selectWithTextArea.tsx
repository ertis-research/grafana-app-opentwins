import React, { useState, Fragment, useEffect } from 'react'
import { Select, TextArea, Button, Icon } from '@grafana/ui'
import { AppEvents, SelectableValue } from '@grafana/data'
import { SelectData } from 'utils/interfaces/select'
import { capitalize, enumNotification } from 'utils/auxFunctions/general'
import { Notification } from 'utils/interfaces/notification'
import { CustomNotification } from './notification'
import { getAppEvents } from '@grafana/runtime'
import { getCurrentUserRole, hasAuth, Roles } from 'utils/auxFunctions/auth'

export interface ParametersExtraButtons {
    selectedConnection: any
    selectedId?: SelectableValue<string>
    isDisabled: boolean
    setShowNotification: any
}

interface Parameters {
    path: string
    name: string
    getByIdFunc: any
    getAllFunc: any
    deleteFunc: any
    ExtraButtonComponent?: React.FC<ParametersExtraButtons>
    minRole?: Roles
}

export const SelectWithTextArea = ({ path, name, getByIdFunc, getAllFunc, deleteFunc, ExtraButtonComponent, minRole = Roles.VIEWER }: Parameters) => {

    const appEvents = getAppEvents()

    const confirmDelete_title = "Delete " + name
    const confirmDelete_body = (id: any) => "Are you sure you want to delete " + name + " " + id + "?"
    const confirmDelete_description = "This action cannot be undone."

    const [objects, setObjects] = useState<SelectData[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [selectedObject, setselectedObject] = useState<any>(undefined)
    const [showNotification, setShowNotification] = useState<Notification>({ state: enumNotification.HIDE, title: "" })
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)

    const handleOnConfirmDelete = () => {
        if (value?.value !== undefined) {
            setShowNotification({ state: enumNotification.LOADING, title: "" })
            deleteFunc(value.value).then(() => {
                appEvents.publish({
                    type: AppEvents.alertSuccess.name,
                    payload: [capitalize(name) + " successfully deleted!"]
                });
            }).catch((e: Error) => {
                let msg = ""
                try {
                    const response = JSON.parse(e.message)
                    msg = response.message
                } catch (e) { }
                appEvents.publish({
                    type: AppEvents.alertError.name,
                    payload: ["Error deleting " + name + ". " + msg]
                });
            }).finally(() => {
                setShowNotification({ state: enumNotification.HIDE, title: "" })
            })
            setValue(undefined)
        }
    }

    const handleOnClickDelete = () => {
        if (value?.value) {
            setShowNotification({
                state: enumNotification.CONFIRM,
                title: confirmDelete_title,
                description: confirmDelete_description,
                body: confirmDelete_body(value?.value),
                onConfirmFunc: handleOnConfirmDelete,
                confirmText: "Delete",
                dismissText: "Cancel"
            })
        }
    }

    const getAll = () => {
        setShowNotification({ state: enumNotification.LOADING })
        getAllFunc(setObjects, () => { setShowNotification({ state: enumNotification.READY }) })
    }

    useEffect(() => {
        if (value && value.value && showNotification.state === enumNotification.READY) {
            getByIdFunc(value.value).then((item: any) => {
                setselectedObject(item)
            }).catch(() => {
                setselectedObject(undefined)
            })
        } else {
            setselectedObject(undefined)
        }
    }, [value, showNotification])

    useEffect(() => {
    }, [selectedObject])


    useEffect(() => {
        //getAllFunc(setObjects)
        getAll()
        getCurrentUserRole().then((role: string) => setUserRole(role))
    }, [])

    useEffect(() => {
        if (showNotification.state === enumNotification.HIDE) {
            getAll()
            //getAllFunc(setObjects)
            //setShowNotification({state: enumNotification.READY, title: ""})
        }
    }, [objects, showNotification])

    const isDisabled = !selectedObject || showNotification.state !== enumNotification.READY

    const extraButtons = (!ExtraButtonComponent) ? <div></div> :
        <div style={{ marginRight: '10px' }}>
            <ExtraButtonComponent selectedConnection={selectedObject} selectedId={value} isDisabled={isDisabled} setShowNotification={setShowNotification} />
        </div>

    const buttons = (selectedObject && value !== undefined) ?
        <div style={{ display: 'flex', justifyItems: 'flex-start', justifyContent: 'flex-start' }}>
            {extraButtons}
            <Button variant="destructive" icon="trash-alt" disabled={isDisabled} onClick={handleOnClickDelete}>Delete</Button>
        </div>
        : <div></div>

    const component =
        <Fragment>
            <div className='row justify-content-between mb-3'>
                <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                    <Select
                        options={objects}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search" />}
                        placeholder="Search"
                        disabled={showNotification.state !== enumNotification.READY}
                    />
                </div>
                <div className={'col-12 col-sm-12 col-md-7 col-lg-7'} >
                    {buttons}
                </div>
            </div>
            <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification} />
            <TextArea className="mt-3" rows={25} value={(selectedObject) ? JSON.stringify(selectedObject, undefined, 4) : ""} readOnly />
        </Fragment>

    const noAllow = <div style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <h5>You do not have sufficient permissions to access this content</h5>
    </div>

    return (hasAuth(userRole, minRole)) ? component : noAllow
}
