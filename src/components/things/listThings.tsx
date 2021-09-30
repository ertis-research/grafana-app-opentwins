import React, { Fragment, useState, useEffect } from 'react';
import { List, ControlledCollapse } from '@grafana/ui';
import { getThingsByTwinService } from 'services/things/getThingsByTwinService';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { getNameFromDittoThing } from 'utils/aux_functions';
//import { SelectableValue } from '@grafana/data';

export function ListThings(props:any) {

    //const [selectedTwin, setSelectedTwin] = useState<SelectableValue<number>>();

    const [things, setThings] = useState<IDittoThing[]>([])
    
    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getThingsByTwinService(props.id).then(res => setThings(res.items)).catch(() => console.log("error"))
        console.log(things)
    }, [])

    return (
        <Fragment>
            <div className="d-flex justify-content-center">
                <a className="m-3 btn btn-primary" href={props.path + '?mode=create'}>Create new thing</a>
            </div>
            <h2>Check existing things</h2>
            <List
                items={things}
                getItemKey={item => item.thingId}
                renderItem={item => (
                    <ControlledCollapse 
                        label={getNameFromDittoThing(item.thingId)}
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
