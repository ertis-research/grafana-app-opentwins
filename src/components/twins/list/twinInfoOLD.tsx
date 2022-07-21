import React, { useState, useEffect, useContext, Fragment } from 'react';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { Card, LinkButton, IconButton, HorizontalGroup, Select, Icon } from '@grafana/ui'
import { deleteTwinService } from 'services/twins/crud/deleteTwinService';
import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { StaticContext } from 'utils/context/staticContext';
import { ISelect } from 'utils/interfaces/select';
import { getChildrenOfTwinService } from 'services/twins/children/getChildrenOfTwinService';
import { defaultIfNoExist, imageIsUndefined } from 'utils/auxFunctions/general';

interface parameters {
    path : string
    id : string
    meta : AppPluginMeta<KeyValue<any>>
}

export function TwinInfo({path, id, meta} : parameters) {

    const [things, setThings] = useState<IDittoThing[]>([])
    const [filteredThings, setFilteredThings] = useState<IDittoThing[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [values, setValues] = useState<ISelect[]>([])
    //const [inputValue, setInputValue] = useState<string>()

    const context = useContext(StaticContext)

    const updateThings = () => {
        getChildrenOfTwinService(context, id).then(res => {
            console.log(res)
            res = (res.items === undefined || res.items === []) ? [] : res.items
            setThings(res)
            console.log(things)
            if(res !== undefined){
                setValues(res.map((item:IDittoThing) => {
                    return {
                        label: item.thingId,
                        value: item.thingId
                    }
                }))
            }
        }).catch(() => console.log("error"))
    }

    const updateFilteredThings = () => {
        if (value == null || value == undefined) {
            setFilteredThings(things)
        } else {
            setFilteredThings(things.filter(thing => {return (value.value != undefined) ? thing.thingId.includes(value.value) : true}))
        }
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        console.log("HOLA")
        console.log(context)
        updateThings()
        updateFilteredThings()
    }, [id])

    useEffect(() => {
        console.log("CAMBIO DE VALUE")
        console.log(value)
        updateFilteredThings()
    }, [value, things])

    const handleOnClickDelete = (thingId:string) => {
        deleteTwinService(context, thingId)
        updateThings()
    }

    const thingsMapped = filteredThings.map((item) =>
        <div className="col-12 col-sm-12 col-md-12 col-lg-5 mb-5" key={item.thingId}>
            <div style={{display: "block", width: "100%"}}>
                <div style={{display: "inline-block", height: "180px", width:"35%", verticalAlign: "top"}}>
                    <a href={path + "?mode=check&id=" + item.thingId}>
                        <img src={imageIsUndefined(defaultIfNoExist(item.attributes, "image", undefined))} style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center"}}/>
                    </a>
                </div>
                <div style={{ height: "180px", width:"65%", display: "inline-block", verticalAlign: "top"}}>
                    <Card 
                        heading={defaultIfNoExist(item.attributes, "name", item.thingId)} 
                        href={path + "?mode=check&id=" + item.thingId}
                        style={{height: "100%"}}>
                        <Card.Meta>
                            <div>
                                <p>{item.thingId}</p>
                                <p style={{maxWidth: "100%", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                    {defaultIfNoExist(item.attributes, "description", "")}
                                </p>
                            </div>
                        </Card.Meta>
                        <Card.SecondaryActions>
                            <IconButton key="edit" name="pen" tooltip="Edit" />
                            <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={() => handleOnClickDelete(item.thingId)}/>
                        </Card.SecondaryActions>
                    </Card>
                </div>
            </div>
        </div>
    );


    return (
        <Fragment>
            <hr/>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + '?mode=create'} className="m-3">
                    Create new twin
                </LinkButton>
            </HorizontalGroup>
            <div className='row justify-content-center mb-3'>
                <div className="col-12 col-sm-12 col-md-10 col-lg-10">
                    <Select
                        options={values}
                        value={value}
                        onChange={v => setValue(v)}
                        prefix={<Icon name="search"/>}
                        onInputChange={(v, action) => {
                            if(action.action == 'set-value' || action.action == 'input-change')
                                setValue({
                                    label: v,
                                    value: v
                            })}
                        }
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="row justify-content-center">
                {thingsMapped}
            </div>
        </Fragment>
    );
}