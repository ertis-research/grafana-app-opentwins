import React, { useState, Fragment } from 'react'
import { Select, TextArea, Button, Icon, ConfirmModal, LinkButton } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { ISelect } from 'utils/interfaces/select'

interface parameters {
    path : string
    tab : string
    name : string
    values : ISelect[]
    deleteFunction : any
    buttonHref ?: string
}

export const SelectWithTextArea = ({ path, tab, name, values, deleteFunction, buttonHref } : parameters) => {

    const [value, setValue] = useState<SelectableValue<string>>()
    const [isOpen, setIsOpen] = useState(false)

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

    const href = (buttonHref !== undefined) ? buttonHref : '?' + ((tab !== undefined) ? "tab=" + tab + "&" : "" ) + 'mode=create'

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
                    <LinkButton variant="primary" href={path + href}>
                        Create new {name}
                    </LinkButton>
                </div>
            </div>
            <TextArea className="mt-3" rows={25} value={value?.text === undefined ? "" : value.text} readOnly/>
            <div className="d-flex justify-content-center">
                <Button className="m-3">Edit</Button>
                <Button className="m-3" variant="destructive" onClick={handleOnClickDelete}>Delete</Button>
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