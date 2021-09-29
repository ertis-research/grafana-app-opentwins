import { CheckBySelect } from 'components/general/checkBySelect';
import React, { useState, useEffect } from 'react';
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService';
import { ISelect } from 'utils/interfaces/select';
/*import { List } from '@grafana/ui';
import { ControlledCollapse } from '@grafana/ui';
import { Select, TextArea, Button } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';*/

interface parameters {
    path : string
}

export const ListPolicies = ({path} : parameters) => {

    const [policies, setPolicies] = useState<ISelect[]>([])

    useEffect(() => {
        getAllPoliciesService().then((res:string[]) => {
            setPolicies(res.map(item => {return {label: item, value: item}}))
        }).catch(() => console.log("error"))
    }, [])
    
    return (
        <CheckBySelect path={path} tab="policies" name="policy" values={policies}/>
    )
}