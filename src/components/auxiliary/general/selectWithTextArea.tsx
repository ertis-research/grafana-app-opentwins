import React, { useState, Fragment, useEffect } from 'react'
import { Select, TextArea, Button, Icon, ConfirmModal, LinkButton } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { ISelect } from 'utils/interfaces/select'

interface parameters {
    path : string
    tab : string
    name : string
    values : ISelect[]
    deleteFunction : any
    getFunction ?: any
}

export const SelectWithTextArea = ({ path, tab, name, values, deleteFunction, getFunction } : parameters) => {

    const [value, setValue] = useState<SelectableValue<string>>()
    const [isOpen, setIsOpen] = useState(false)
    const [text, setText] = useState<string>("")

    const handleOnClickDelete = () => {
        if(value !== undefined){
            setIsOpen(true)
        }
    }

    const handleOnConfirmModal = () => {
        if(value?.value !== undefined){
            deleteFunction(value.value)
            setValue(undefined)
        } 
        setIsOpen(false)
    }

    const handleOnDismissModal = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if(!value || (!getFunction && !value.text)){
            setText("")
        } else if(getFunction  && !value.text){
            getFunction(value.label).then((item:any) => {
                setText(JSON.stringify(item, undefined, 4))
            })
        } else {
            setText(value.text)
        }
    }, [value])

    useEffect(() => {
    }, [text, isOpen])

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-8 col-12">
                    <Select
                        options={values}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search"/>}
                    />
                </div>
                <div className="col-md-4 text-end col-12">
                    <LinkButton variant="primary" href={path + "&mode=create"}>
                        Create new {name}
                    </LinkButton>
                </div>
            </div>
            <TextArea className="mt-3" rows={25} value={text} readOnly/>
            <div className="d-flex justify-content-center">
                <Button className="m-3" disabled={value == undefined}>Edit</Button>
                <Button className="m-3" variant="destructive" onClick={handleOnClickDelete} disabled={value == undefined}>Delete</Button>
            </div>
            <ConfirmModal
                isOpen={isOpen}
                title={"Delete " + name}
                body={"Are you sure you want to delete this " + name + "?"}
                confirmText='Confirm'
                icon='exclamation-triangle'
                onConfirm={handleOnConfirmModal}
                onDismiss={handleOnDismissModal}
            />
        </Fragment>
    )

}