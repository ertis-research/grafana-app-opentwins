import React, { useState, Fragment } from 'react'
import { Select, TextArea, Button, HorizontalGroup, LinkButton, Legend, Icon } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'

export const CheckBySelect = (props:any) => {

    const [value, setValue] = useState<SelectableValue<number>>()

    const tabPath = (props.tab !== undefined) ? "tab=" + props.tab + "&" : "" 

    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={props.path + '?' + tabPath + 'mode=create'}>
                    Create new {props.name}
                </LinkButton>
            </HorizontalGroup>
            <Legend>Check an existing {props.name}</Legend>
            <Select
                options={props.values}
                value={value}
                onChange={v => setValue(v)}
                prefix={<Icon name="arrow-down"/>}
            />
            <TextArea className="w-100 h-100 mt-3" style={{boxSizing: "border-box"}} value={value?.text === undefined ? "" : value.text.replaceAll('"', '')} readOnly/>
            <div className="d-flex justify-content-center">
                <Button className="m-3">Edit</Button>
                <Button className="m-3" variant="destructive">Delete</Button>
            </div>
        </Fragment>
    )

}