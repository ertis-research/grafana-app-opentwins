import React, { Fragment, useState, useEffect } from 'react';
import { List, ControlledCollapse } from '@grafana/ui';
import { getTwinsService } from 'services/twins/getTwinsService';
import { IDittoThing } from 'utils/interfaces';
//import { SelectableValue } from '@grafana/data';

export function ListTwins(props:any) {

    //const [selectedTwin, setSelectedTwin] = useState<SelectableValue<number>>();

    const [realTwins, setRealTwins] = useState<IDittoThing[]>([])

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getTwinsService(props.id).then(res => setRealTwins(res.items))
        console.log(realTwins)
    }, [])

    return (
        <Fragment>
            <div className="d-flex justify-content-center">
                <a className="m-3 btn btn-primary" href={props.path + '?mode=create'}>Create new twin</a>
            </div>
            <h2>Check existing twins</h2>
            <List
                items={realTwins}
                getItemKey={item => item.thingId}
                renderItem={item => (
                    <ControlledCollapse 
                        label={item.thingId}
                        collapsible>
                        <p>{item.policyId}</p>
                        <p>{JSON.stringify(item.attributes, null, "\t")}</p>
                        <p>{JSON.stringify(item.features, null, "\t")}</p>
                    </ControlledCollapse>
                )}
            />
        </Fragment>
    );
}
