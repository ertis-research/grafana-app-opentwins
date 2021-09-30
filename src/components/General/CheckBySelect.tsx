import React, { useState, Fragment } from 'react'
import { Select, TextArea, Button, HorizontalGroup, LinkButton, Legend, Icon, ConfirmModal } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { ISelect } from 'utils/interfaces/select'

interface parameters {
    path : string
    tab : string
    name : string
    values : ISelect[]
    deleteFunction : any
}

export const CheckBySelect = ({ path, tab, name, values, deleteFunction } : parameters) => {

    const [value, setValue] = useState<SelectableValue<number>>()
    const [isOpen, setIsOpen] = useState(false)

    const handleOnClickDelete = () => {
        if(value !== undefined){
            setIsOpen(true)
        }
    }

    const handleOnConfirmModal = () => {
        if(value?.value !== undefined) deleteFunction(value.value)
        setIsOpen(false)
    }

    const handleOnDismissModal = () => {
        setIsOpen(false)
    }

    //Para hacer el get de policy: hacer un useEffect que ejecute una funcion que pasamos como parametro. A esta
    //funcion le pasamos value y setValue para que pueda hacer sus cosas. En el caso de no necesitas funcion dejar
    //parametro como undefined y si lo es no se tendrá en cuenta


    const tabPath = (tab !== undefined) ? "tab=" + tab + "&" : "" 

    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + '?' + tabPath + 'mode=create'}>
                    Create new {name}
                </LinkButton>
            </HorizontalGroup>
            <Legend>Check an existing {name}</Legend>
            <Select
                options={values}
                value={value}
                onChange={v => setValue(v)}
                prefix={<Icon name="arrow-down"/>}
            />
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