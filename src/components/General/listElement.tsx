import React from 'react'
import { Card, IconButton } from '@grafana/ui'


export function ListElement(name:string, list:any, setList:any) {

    const handleOnClickDelete = () => {
        setList(list.filter((item:any) => item.name !== name))
    }

    return (
        <Card heading={name}>
            <Card.SecondaryActions>
                <IconButton key="edit" name="pen" tooltip="Edit" />
                <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={handleOnClickDelete}/>
            </Card.SecondaryActions>
        </Card>
    )
}