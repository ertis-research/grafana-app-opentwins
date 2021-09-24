import { CheckBySelect } from 'components/general/checkBySelect';
import React, { useEffect, useState } from 'react';
import { getTypesService } from 'services/types/getTypesService';
import { getNameFromDittoThing } from 'utils/aux_functions';
import { IDittoThing } from 'utils/interfaces';
//import { IDittoThing } from 'utils/interfaces';

export const ListTypes = (props:any) => {

    /*
    const types = [
        {label: 'hola', value: 1},
        {label: 'DHT22', value: 2, text: '"attributes": {\n\t"location": "Spain"\n},\n"features": {\n\t"temperature": {\n\t\t"properties": {\n\t\t\t"value": null\n\t\t}\n\t},\n\t"humidity": {\n\t\t"properties": {\n\t\t\t"value": null\n\t\t}\n\t}\n}'},
        {label: 'aaa', value: 3, text:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa as a a a a a aaa a a a aa Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'}
    ]*/

    const [types, setTypes] = useState([])
    
    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getTypesService().then(res => 
            setTypes(
                JSON.parse(
                    "[" + 
                    res.items.map((item:IDittoThing) => '{"label": "' + getNameFromDittoThing(item.thingId) + '", "value": "' + item.thingId + 
                    '", "text": "' + item.policyId + " " + JSON.stringify(item.attributes).replace(/"/g, '') + " " + JSON.stringify(item.features).replace(/"/g, '') + '"}').join(",") + 
                    "]"
                )
            )
            
        )
        //data.map(item => item)
    }, [])

    return (
        <CheckBySelect path={props.path} tab="types" name="type" values={types}/>
    );
        /*
        <List 
            items={types}
            getItemKey={item => item.id.toString()}
            renderItem={item => (
                <ControlledCollapse 
                    label={item.name}
                    collapsible>
                    <p>{item.description}</p>
                </ControlledCollapse>
            )}
        />*/

}