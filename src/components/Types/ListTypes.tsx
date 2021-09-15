import { CheckBySelect } from 'components/General/CheckBySelect';
import React from 'react';

export const ListTypes = (props:any) => {

    const types = [
        {label: 'hola', value: 1},
        {label: 'DHT22', value: 2, text: '"attributes": {\n\t"location": "Spain"\n},\n"features": {\n\t"temperature": {\n\t\t"properties": {\n\t\t\t"value": null\n\t\t}\n\t},\n\t"humidity": {\n\t\t"properties": {\n\t\t\t"value": null\n\t\t}\n\t}\n}'},
        {label: 'aaa', value: 3, text:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa as a a a a a aaa a a a aa Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'}
    ]

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