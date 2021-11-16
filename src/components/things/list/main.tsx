import React, { useState, useEffect } from 'react';
import { getThingsByTwinService } from 'services/things/getThingsByTwinService';
import { CheckBySelect } from 'components/general/checkBySelect';
import { ISelect } from 'utils/interfaces/select';
import { getSelectFromDittoThingArray } from 'utils/aux_functions';
import { deleteThingService } from 'services/things/deleteThingService';
//import { SelectableValue } from '@grafana/data';

interface parameters {
    path : string,
    id : string
}

export function ListThings({ path, id } : parameters) {

    //const [selectedTwin, setSelectedTwin] = useState<SelectableValue<number>>();

    const [things, setThings] = useState<ISelect[]>([])
    
    const updateThings = () => {
        getThingsByTwinService(id).then((res) => setThings(getSelectFromDittoThingArray(res.items)))
    }

    const handleDeleteThing = (value:string) => {
        deleteThingService(value)
        updateThings()
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        updateThings()
    }, [])

    return (
        <CheckBySelect path={path} tab="things" name="thing" values={things} deleteFunction={handleDeleteThing} buttonHref={'?mode=create&id=' + id}/>

        /*
        <Fragment>
            <div className="d-flex justify-content-center">
                <a className="m-3 btn btn-primary" href={path + '?mode=create&id=' + id}>Create new thing</a>
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
        </Fragment>*/
    );
}
