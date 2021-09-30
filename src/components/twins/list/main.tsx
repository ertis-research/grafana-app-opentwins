import React, { useState, useEffect, Fragment } from 'react';
import { getAllTwinsService } from 'services/twins/getAllTwinsService';
import { ITwin } from 'utils/interfaces/dittoThing';
import { Card, LinkButton, IconButton, Legend, HorizontalGroup } from '@grafana/ui'
import { DEFAULT_IMAGE_TWIN } from 'utils/consts';

export function ListTwins(props:any) {
    /*
    const mainObjects = [
        {id: 'sensor', name: 'Raspberry', description: 'Dispositivo raspberry pi compuesto de un sensor DHT22', image: 'https://hardzone.es/app/uploads-hardzone.es/2020/06/Proyectos-Raspberry-Pi.jpg'},
        {id: 2, name: 'Robot de riego', description: 'Robot ubicado en Córdoba cuya principal función es el riego. Compuesto de X sensores y...', image: 'https://agriculturers.com/wp-content/uploads/2018/09/El-robot-de-los-vinedos-modernos.jpg'},
        {id: 3, name: 'Telescopio', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis erat eros. Curabitur scelerisque mi id blandit pharetra. Phasellus blandit.', image: 'https://www.dhresource.com/0x0/f2/albu/g7/M01/DB/49/rBVaSluWVFiAXEhrAARdFPIxPnM586.jpg/monocular-space-astronomical-telescope-outdoor.jpg'},
        {id: 4, name: 'Puente', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ornare massa leo, sit amet euismod arcu consectetur et. Nunc ex.', image: 'https://sfo2.digitaloceanspaces.com/elpaiscr/2019/05/puente_virilla_ruta_32.jpg'}
    ]*/

    const [twins, setTwins] = useState<ITwin[]>([])

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getAllTwinsService().then(res => {setTwins(res)
            console.log("hola")
            console.log(twins)}).catch(() => console.log("error"))
        
    }, [])

    const imageIsUndefined = (url:(string|undefined)) => {
        return (url !== undefined && url !== '') ? url : DEFAULT_IMAGE_TWIN + ''
    }

    const twinsMapped = twins.map((item) =>
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-3" key={item.id}>
            <div>
            <img src={imageIsUndefined(item.image)} className="card-img-top" style={{height: "250px", objectFit: "cover"}} alt="..."/>
            </div>
            <Card heading={item.name} style={{height: "150px"}}>
                <Card.Meta>
                    {item.description}
                </Card.Meta>
                <Card.Actions>
                    <LinkButton icon="search" key="seemore" variant="secondary" href={props.path + "?mode=check&id=" + item.id}>
                        See more
                    </LinkButton>
                    <div></div>
                </Card.Actions>
                <Card.SecondaryActions>
                    <IconButton key="edit" name="pen" tooltip="Edit" />
                    <IconButton key="delete" name="trash-alt" tooltip="Delete" />
                </Card.SecondaryActions>
            </Card>
        </div>
    );

    
    return (
        <Fragment>
            <HorizontalGroup justify="center">
                <LinkButton variant="primary" href={props.path + '?mode=create'}>
                    Create new twin
                </LinkButton>
            </HorizontalGroup>
            <Legend>Check existing twins</Legend>
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