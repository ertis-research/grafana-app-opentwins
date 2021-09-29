import React, { useState, Fragment } from 'react'
import { Select, TextArea, Button, HorizontalGroup, LinkButton, Legend, Icon } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'

export const CheckBySelect = (props:any) => {

    const [value, setValue] = useState<SelectableValue<number>>()

    //Para hacer el get de policy: hacer un useEffect que ejecute una funcion que pasamos como parametro. A esta
    //funcion le pasamos value y setValue para que pueda hacer sus cosas. En el caso de no necesitas funcion dejar
    //parametro como undefined y si lo es no se tendrá en cuenta


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
            <TextArea className="mt-3" rows={25} value={value?.text === undefined ? "" : value.text} readOnly/>
            <div className="d-flex justify-content-center">
                <Button className="m-3">Edit</Button>
                <Button className="m-3" variant="destructive">Delete</Button>
            </div>
        </Fragment>
    )

}