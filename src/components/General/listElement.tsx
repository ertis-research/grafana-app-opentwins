import React from 'react'
import { Card, IconButton } from '@grafana/ui'

export function ListElement(name : string, list : any, setList : any, forEqualKeys : {key: string, value: string}[]) {

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

    return (
        <Card heading={name}>
            <Card.SecondaryActions>
                <IconButton key="edit" name="pen" tooltip="Edit" />
                <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={handleOnClickDelete}/>
            </Card.SecondaryActions>
        </Card>
    )
}