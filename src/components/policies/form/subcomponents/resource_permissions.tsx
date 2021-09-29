import React, { useState, FormEvent } from 'react'
import { Checkbox, IconButton, useTheme2 } from '@grafana/ui'
import { IResource } from 'utils/interfaces/dittoPolicy'

interface parameters {
    resource: IResource
    resources : any
    setResources : any
}

export const Resource_permissions = ({resource, resources, setResources} : parameters) => {

    const [read, setRead] = useState(resource.read)
    const [write, setWrite] = useState(resource.write)

    const handleOnChangeCheckbox = (event:FormEvent<HTMLInputElement>, setFunction:any, variable:any, grant:boolean, isRead:boolean) => {
        setFunction((variable === undefined) ? grant : (variable == grant) ? undefined : !variable)
        const newResources = resources.map((item:any) => {
            if(item.name === resource.name){
                var updatedItem = undefined
                if(isRead){
                    updatedItem = {
                        ...item,
                        read : variable
                    }
                } else {
                    updatedItem = {
                        ...item,
                        write : variable
                    }
                }
                return updatedItem
            }
            return item
        })
        setResources(newResources)
    }

    const handleOnClickDelete = () => {
        setResources(resources.filter((item:any) => item.name !== resource.name))
    }

    const header = 
        <div className="d-flex justify-content-between">
            <h5 className="text-capitalize mb-0">{resource.name}</h5>
            { resource.erasable ? 
                <IconButton name="trash-alt" onClick={handleOnClickDelete}></IconButton>   
                : <div></div> 
            }
        </div>

    return (
        <div className="my-3 p-3" style={{backgroundColor:useTheme2().colors.background.canvas}}>
            {header}
            <p className="mt-0" style={{color:useTheme2().colors.text.secondary}}>{resource.description}</p>
            <div className="row mt-0">
                <div className="col-6">
                    <h6>Grant:</h6>
                    <div className="row">
                        <div className="col-3">
                            <Checkbox 
                                name={resource.name + "_grant_read"} 
                                label="READ" 
                                key={resource.name + "_grant_read"} 
                                value={read} 
                                onChange={(e) => handleOnChangeCheckbox(e, setRead, read, true, true)} 
                            />
                        </div>
                        <div className="col-9">
                            <Checkbox 
                                className="ml-3"
                                name={resource.name + "_grant_write"} 
                                label="WRITE" 
                                key={resource.name + "_grant_write"} 
                                value={write} 
                                onChange={(e) => handleOnChangeCheckbox(e, setWrite, write, true, false)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <h6>Revoke:</h6>
                    <div className="row">
                        <div className="col-3">
                            <Checkbox 
                                name={resource.name + "_revoke_read"} 
                                label="READ" 
                                key={resource.name + "_revoke_read"} 
                                value={(read === undefined) ? undefined : !read} 
                                onChange={(e) => handleOnChangeCheckbox(e, setRead, read, false, true)} 
                            />
                        </div>
                        <div className="col-9">
                            <Checkbox 
                                className="ml-3"
                                name={resource.name + "_revoke_write"} 
                                label="WRITE" 
                                key={resource.name + "_revoke_write"} 
                                value={(write === undefined) ? undefined : !write} 
                                onChange={(e) => handleOnChangeCheckbox(e, setWrite, write, false, false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}