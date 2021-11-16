import { CheckBySelect } from 'components/general/checkBySelect'
import React, { useState, useEffect } from 'react'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { IPolicy } from 'utils/interfaces/dittoPolicy'
import { ISelect } from 'utils/interfaces/select'
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
        getAllPoliciesService().then((res:IPolicy[]) => {
            setPolicies(res.map((item:IPolicy) => {
                return {
                    label : item.policyId,
                    value : item,
                    text: JSON.stringify(item, undefined, 4)
                }
            }))
        })
    }, [])
    
    return (
        <CheckBySelect path={path} tab="policies" name="policy" values={policies} deleteFunction={handleDeletePolicy} />
    )
}