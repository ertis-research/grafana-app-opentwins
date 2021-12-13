import React, { useState, useEffect, useContext, Fragment } from 'react';
import { getAllTwinsService } from 'services/twins/getAllTwinsService';
import { ITwin } from 'utils/interfaces/dittoThing';
import { Card, LinkButton, IconButton, Legend, HorizontalGroup } from '@grafana/ui'
import { DEFAULT_IMAGE_TWIN } from 'utils/data/consts';
import { deleteTwinService } from 'services/twins/deleteTwinService';
import { AppPluginMeta, KeyValue } from '@grafana/data';
import { StaticContext } from 'utils/context/staticContext';

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
}

export function ListTwins({path, meta} : parameters) {

    const [twins, setTwins] = useState<ITwin[]>([])

    const context = useContext(StaticContext)

    const updateTwins = () => {
        getAllTwinsService(context).then(res => {setTwins(res)
            console.log(twins)}).catch(() => console.log("error"))
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        console.log("HOLA")
        console.log(context)
        updateTwins()
    }, [])

    const imageIsUndefined = (url:(string|undefined)) => {
        return (url !== undefined && url !== '') ? url : DEFAULT_IMAGE_TWIN + ''
    }

    const handleOnClickDelete = (twinId:string) => {
        deleteTwinService(context, twinId)
        updateTwins()
    }

    const twinsMapped = twins.map((item) =>
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-3" key={item.twinId}>
            <div>
            <img src={imageIsUndefined(item.image)} className="card-img-top" style={{height: "250px", objectFit: "cover"}} alt="..."/>
            </div>
            <Card heading={item.name} style={{height: "150px"}}>
                <Card.Meta>
                    {item.description}
                </Card.Meta>
                <Card.Actions>
                    <LinkButton icon="search" key="seemore" variant="secondary" href={path + "?mode=check&id=" + item.twinId}>
                        See more
                    </LinkButton>
                    <div></div>
                </Card.Actions>
                <Card.SecondaryActions>
                    <IconButton key="edit" name="pen" tooltip="Edit" />
                    <IconButton key="delete" name="trash-alt" tooltip="Delete" onClick={() => handleOnClickDelete(item.twinId)}/>
                </Card.SecondaryActions>
            </Card>
        </div>
    );

    
    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={path + '?mode=create'}>
                    Create new twin
                </LinkButton>
            </HorizontalGroup>
            <Legend>My twins</Legend>
            <div className="row">
                {twinsMapped}
            </div>
        </Fragment>
    );

/*
    const mainObjectsMapped = mainObjects.map((item) =>
        <div className="col-4 mb-3 d-flex align-items-stretch" key={item.id}>
            <div className="card t.colors.background.primary" >
                <img src={item.image} className="card-img-top" style={{height: "250px", objectFit: "cover"}} alt="..."/>
                <div className="card-body d-flex flex-column">
                    <h4 className="card-title">{item.name}</h4>
                    <p className="card-text">{item.description}</p>
                    <a href={props.path + "?mode=check&id=" + item.id} className="btn btn-primary mt-auto align-self-start">See more</a>
                </div>
            </div>
        </div>
    );

    
    return (
        <Fragment>
            <div className="d-flex justify-content-center">
                <a className="m-3 btn btn-primary" href={props.path + '?mode=create'}>Create new main object</a>
            </div>
            <h2>Check existing main objects</h2>
            <div className="row">
                {mainObjectsMapped}
            </div>
        </Fragment>
    );
*/
}