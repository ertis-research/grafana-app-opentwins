import React, { useState, Fragment } from 'react';
import { Select, TextArea, Button } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

export const CheckBySelect = (props:any) => {

    const [value, setValue] = useState<SelectableValue<number>>();

    const tabPath = (props.tab !== undefined) ? "tab=" + props.tab + "&" : "" 

    return (
        <Fragment>
            <div className="d-flex justify-content-center">
                <a className="m-3 btn btn-primary" href={props.path + '?' + tabPath + 'mode=create'}>Create new {props.name}</a>
            </div>
            <h2>Check an existing {props.name}</h2>
            <Select
                options={props.values}
                value={value}
                onChange={v => setValue(v)}
            />
            <TextArea className="w-100 h-100 mt-3" style={{boxSizing: "border-box"}} value={value?.text === undefined ? "" : value.text.replaceAll('"', '')} readOnly/>
            <div className="d-flex justify-content-center">
                <Button className="m-3">Edit</Button>
                <Button className="m-3" variant="destructive">Delete</Button>
            </div>
        </Fragment>
    );

}