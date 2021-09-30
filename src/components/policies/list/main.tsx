import { CheckBySelect } from 'components/general/checkBySelect';
import React, { useState, useEffect } from 'react';
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService';
import { getPolicyByIdService } from 'services/policies/getPolicyByIdService';
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

    const handleDeletePolicy = () => {
        
    }


    useEffect(() => {
        getAllPoliciesService().then((res:string[]) => {
            var policiesList:ISelect[] = []
            res.forEach(async item => {
                const text = await getPolicyByIdService(item)
                policiesList.push({
                    label: item,
                    value: item,
                    text: JSON.stringify(text, undefined, 4)
                })
            })
            setPolicies(policiesList)
        })
    }, [])
    
    return (
        <CheckBySelect path={path} tab="policies" name="policy" values={policies} deleteFunction={handleDeletePolicy} />
    )
}