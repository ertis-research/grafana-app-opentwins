import React from 'react'
import { Card, IconButton } from '@grafana/ui'

export function ListElement(name : string, list : any, setList : any, forEqualKeys : {key: string, value: string}[], disabled : boolean) {

    const handleOnClickDelete = () => {
        setList(list.filter((item:any) => {
            var equal = true
            var i = 0
            while(i < forEqualKeys.length && equal){
                const element = forEqualKeys[i]
                equal = item[element.key] === element.value
                i++
            }
            return !equal
        }))
    }

    //<IconButton key="edit" name="pen" tooltip="Edit" />

    return (
        <Card heading={name} style={{wordWrap: 'break-word'}}>
            <Card.SecondaryActions>
                <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={handleOnClickDelete} disabled={disabled}/>
            </Card.SecondaryActions>
        </Card>
    )
}