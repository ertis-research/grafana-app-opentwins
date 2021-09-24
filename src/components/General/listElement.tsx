import React from 'react'
import { Card, IconButton } from '@grafana/ui'


export function ListElement(name:string) {
    return (
        <Card heading={name}>
            <Card.SecondaryActions>
                <IconButton key="edit" name="pen" tooltip="Edit" />
                <IconButton key="delete" name="trash-alt" tooltip="Delete" />
            </Card.SecondaryActions>
        </Card>
    )
}