import React, { useState, Fragment, useEffect } from 'react'
import { Select, TextArea, Button, Icon, LinkButton, HorizontalGroup } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { ISelect } from 'utils/interfaces/select'
import { capitalize, enumNotification } from 'utils/auxFunctions/general'
import { INotification } from 'utils/interfaces/notification'
import { CustomNotification } from './notification'

export interface parametersExtraButtons {
    selectedConnection : any
    selectedId ?: SelectableValue<string>
    isDisabled : boolean
    setShowNotification : any
}

interface parameters {
    path : string
    name : string
    getByIdFunc : any
    getAllFunc : any
    deleteFunc : any
    ExtraButtonComponent ?: React.FC<parametersExtraButtons>
}

export const SelectWithTextArea = ({ path, name, getByIdFunc, getAllFunc, deleteFunc, ExtraButtonComponent } : parameters) => {

    const confirmDelete_title = "Delete " + name
    const confirmDelete_body = (id) => "Are you sure you want to delete " + name + " " + id + "?"
    const confirmDelete_description = "This action cannot be undone."

    const [objects, setObjects] = useState<ISelect[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [selectedObject, setselectedObject] = useState<any>(undefined)
    const [showNotification, setShowNotification] = useState<INotification>({state: enumNotification.HIDE, title: ""})


    const handleOnClickEdit = () => {

    }

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

    useEffect(() => {
        if(value && value.label && showNotification.state == enumNotification.READY){
            getByIdFunc(value.label).then((item:any) => {
                setselectedObject(item)
            }).catch(() => {
                setselectedObject(undefined)
            })
        } else {
            setselectedObject(undefined)
        }
        console.log("value - showNotification")
    }, [value, showNotification])

    useEffect(() => {
        console.log("selectedObject")
    }, [selectedObject])


    useEffect(() => {
        getAllFunc(setObjects)
        console.log("ini")
    }, [])

    useEffect(() => {
        if(showNotification.state == enumNotification.HIDE){
            getAllFunc(setObjects)
            setShowNotification({state: enumNotification.READY, title: ""})
        }
        console.log("objects - showNotification")
    }, [objects, showNotification])

    const isDisabled = !selectedObject || showNotification.state !== enumNotification.READY

    const extraButtons = (!ExtraButtonComponent) ? <div></div> :
        <ExtraButtonComponent selectedConnection={selectedObject} selectedId={value} isDisabled={isDisabled} setShowNotification={setShowNotification} />

    const buttons = (selectedObject) ? 
        <HorizontalGroup justify="center">
            {extraButtons}
            <Button variant="secondary" icon="pen" disabled={isDisabled} onClick={handleOnClickEdit}>Edit</Button>
            <Button variant="destructive" icon="trash-alt" disabled={isDisabled} onClick={handleOnClickDelete}>Delete</Button>
        </HorizontalGroup>
        : <div></div>

    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + "&mode=create"} className="m-3" icon="plus" disabled={showNotification.state !== enumNotification.READY}>
                    Create new {name}
                </LinkButton>
            </HorizontalGroup>
            <div className='row justify-content-center mb-3'>
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
            </div>
            {buttons}
            <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification}/>
            <TextArea className="mt-3" rows={25} value={(selectedObject) ? JSON.stringify(selectedObject, undefined, 4) : ""} readOnly/>
        </Fragment>
    )

}