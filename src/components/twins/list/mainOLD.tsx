import React, { useState, useEffect, useContext, Fragment } from 'react';
import { getAllRootTwinsService } from 'services/twins/getAllRootTwinsService';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { Card, LinkButton, IconButton, HorizontalGroup, Select, Icon } from '@grafana/ui'
import { deleteTwinByIdService } from 'services/twins/crud/deleteTwinByIdService';
import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { StaticContext } from 'utils/context/staticContext';
import { ISelect } from 'utils/interfaces/select';
import { defaultIfNoExist, imageIsUndefined } from 'utils/auxFunctions/general';

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
}

export function ListTwins({path, meta} : parameters) {

    const [things, setThings] = useState<IDittoThing[]>([])
    const [filteredThings, setFilteredThings] = useState<IDittoThing[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()
    const [values, setValues] = useState<ISelect[]>([])
    //const [inputValue, setInputValue] = useState<string>()

    const context = useContext(StaticContext)

    const updateThings = () => {
        getAllRootTwinsService(context).then(res => {
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
    }, [])

    useEffect(() => {
        console.log("CAMBIO DE VALUE")
        console.log(value)
        updateFilteredThings()
    }, [value, things])

    const handleOnClickDelete = (e:any, thingId:string) => {
        e.preventDefault()
        deleteTwinByIdService(context, thingId)
        updateThings()
    }

    const thingsMapped = filteredThings.map((item) =>
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={item.thingId}>
            <div style={{display: "block", width: "100%"}}>
                <div style={{display: "inline-block", height: "180px", width:"35%", verticalAlign: "top"}}>
                    <a href={path + "?mode=check&id=" + item.thingId}>
                        <img src={imageIsUndefined(defaultIfNoExist(item.attributes, "image", undefined))} style={{ height: "100%", width: "100%", objectFit: "cover", objectPosition: "center"}}/>
                    </a>
                </div>
                <div style={{height: "180px", width:"65%", display: "inline-block", verticalAlign: "top"}}>
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
                            <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={(e) => handleOnClickDelete(e, item.thingId)}/>
                        </Card.SecondaryActions>
                    </Card>
                </div>
            </div>
        </div>
    );


    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + '?mode=create'} className="m-3">
                    Create new twin
                </LinkButton>
            </HorizontalGroup>
            <hr/>
            <div className='row justify-content-center mb-3'>
                <div className="col-12 col-sm-12 col-md-7 col-lg-7">
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
            <div className="row">
                {thingsMapped}
            </div>
        </Fragment>
    );
}