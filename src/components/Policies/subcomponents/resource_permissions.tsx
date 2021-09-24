import React, { useState, FormEvent } from 'react';
import { Checkbox, Container, Field, Input } from '@grafana/ui';
import { IResource } from 'utils/interfaces';

interface parameters {
    resource: IResource,
    handleSubmit : any
}

export const Resource_permissions = ({resource, handleSubmit} : parameters) => {

    const [read, setRead] = useState(resource.read)
    const [write, setWrite] = useState(resource.write)

    const handleOnChangeCheckbox = (event:FormEvent<HTMLInputElement>, setFunction:any, variable:any, grant:boolean) => {
        setFunction((variable === undefined) ? grant : (variable == grant) ? undefined : !variable)
    }

    const nameInputOrText = () => {
        if(resource.name === undefined){
            return (
                <Field label="Feature">
                    <Input name="nameFeature" type="text"/>
                </Field>
            );
        } else {
            return (<h4 className="text-capitalize">{resource.name}</h4>);
        }
    }

    return (
        <Container>
            <form id="resourcesForm" onSubmit={handleSubmit}>
                {nameInputOrText}
                <div className="row">
                    <div className="col-6">
                        <h6>Grant:</h6>
                        <div className="row">
                            <div className="col-4">
                                <Checkbox 
                                    name={resource.name + "_grant_read"} 
                                    label="READ" 
                                    key={resource.name + "_grant_read"} 
                                    value={read} 
                                    onChange={(e) => handleOnChangeCheckbox(e, setRead, read, true)} 
                                />
                            </div>
                            <div className="col-8">
                                <Checkbox 
                                    className="ml-3"
                                    name={resource.name + "_grant_write"} 
                                    label="WRITE" 
                                    key={resource.name + "_grant_write"} 
                                    value={write} 
                                    onChange={(e) => handleOnChangeCheckbox(e, setWrite, write, true)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <h6>Revoke:</h6>
                        <div className="row">
                            <div className="col-4">
                                <Checkbox 
                                    name={resource.name + "_revoke_read"} 
                                    label="READ" 
                                    key={resource.name + "_revoke_read"} 
                                    value={(read === undefined) ? undefined : !read} 
                                    onChange={(e) => handleOnChangeCheckbox(e, setRead, read, false)} 
                                />
                            </div>
                            <div className="col-8">
                                <Checkbox 
                                    className="ml-3"
                                    name={resource.name + "_revoke_write"} 
                                    label="WRITE" 
                                    key={resource.name + "_revoke_write"} 
                                    value={(write === undefined) ? undefined : !write} 
                                    onChange={(e) => handleOnChangeCheckbox(e, setWrite, write, false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Container>
    )
}