import React, {Fragment} from 'react';
import {List, ControlledCollapse} from '@grafana/ui';
//import { SelectableValue } from '@grafana/data';

export function ListTwins(props:any) {

    /////const [selectedTwin, setSelectedTwin] = useState<SelectableValue<number>>();

    const twins = [
        {id:"dht22_1", especification:""}
    ]

    return (
        <Fragment>
            <List 
            items={twins}
            getItemKey={item => item.id.toString()}
            renderItem={item => (
                <ControlledCollapse 
                    label={item.id}
                    collapsible>
                    <p>{item.especification}</p>
                </ControlledCollapse>
            )}
            />
        </Fragment>
    );
}