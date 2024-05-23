import React, { useState, Fragment, useEffect } from 'react'
import { Select, TextArea, Button, Icon, HorizontalGroup } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { SelectData } from 'utils/interfaces/select'
import { capitalize, enumNotification } from 'utils/auxFunctions/general'
import { Notification } from 'utils/interfaces/notification'
import { CustomNotification } from './notification'

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
    disableCreate?: boolean
}

export const SelectWithTextArea = ({ path, name, getByIdFunc, getAllFunc, deleteFunc, ExtraButtonComponent, disableCreate=false }: Parameters) => {

    const confirmDelete_title = "Delete " + name
    const confirmDelete_body = (id: any) => "Are you sure you want to delete " + name + " " + id + "?"
    const confirmDelete_description = "This action cannot be undone."

    const [objects, setObjects] = useState<SelectData[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [selectedObject, setselectedObject] = useState<any>(undefined)
    const [showNotification, setShowNotification] = useState<Notification>({state: enumNotification.HIDE, title: ""})

    const handleOnConfirmDelete = () => {
        if(value?.value !== undefined){
            setShowNotification({state: enumNotification.LOADING, title: ""})
            deleteFunc(value.value).then(() => {
                setShowNotification({
                    state: enumNotification.SUCCESS, 
                    title: capitalize(name) + " successfully deleted!"
                })
            }).catch(() => {
                setShowNotification({
                    state: enumNotification.ERROR, 
                    title: "Error deleting " + name
                })
            })
            setValue(undefined)
        }
    }

    const handleOnClickDelete = () => {
        if(value?.value){
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
        setShowNotification({state: enumNotification.LOADING})
        getAllFunc(setObjects, () => {setShowNotification({state: enumNotification.READY})})
    }

    useEffect(() => {
        if(value && value.value && showNotification.state === enumNotification.READY){
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
    }, [])

    useEffect(() => {
        if(showNotification.state === enumNotification.HIDE){
            getAll()
            //getAllFunc(setObjects)
            //setShowNotification({state: enumNotification.READY, title: ""})
        }
    }, [objects, showNotification])

    const isDisabled = !selectedObject || showNotification.state !== enumNotification.READY

    const extraButtons = (!ExtraButtonComponent) ? <div></div> :
        <ExtraButtonComponent selectedConnection={selectedObject} selectedId={value} isDisabled={isDisabled} setShowNotification={setShowNotification} />

    const buttons = (selectedObject && value !== undefined) ? 
        <HorizontalGroup justify="flex-end">
            {extraButtons}
            <Button variant="destructive" icon="trash-alt" disabled={isDisabled} onClick={handleOnClickDelete}>Delete</Button>
        </HorizontalGroup>
        : <div></div>
//            <LinkButton variant="secondary" href={path + "&id=" + value.value + "&mode=edit"} icon="pen" disabled={showNotification.state !== enumNotification.READY}>Edit</LinkButton>

/*
    const createButton = (!disableCreate) ?
        <HorizontalGroup justify="center">
            <LinkButton variant="primary" href={path + "&mode=create"} className="m-3" icon="plus" disabled={showNotification.state !== enumNotification.READY}>
                Create new {name}
            </LinkButton>
        </HorizontalGroup>
        : <div></div>
*/
    return (
        <Fragment>
            <div className='row justify-content-between mb-3'>
                <div className="col-12 col-sm-12 col-md-7 col-lg-7">
                    <Select
                        options={objects}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search"/>}
                        placeholder="Search"
                        disabled={showNotification.state !== enumNotification.READY}
                    />
                </div>
                <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                    {buttons}
                </div>
            </div>
            <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification}/>
            <TextArea className="mt-3" rows={25} value={(selectedObject) ? JSON.stringify(selectedObject, undefined, 4) : ""} readOnly/>
        </Fragment>
    )

}
