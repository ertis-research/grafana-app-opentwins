import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React, { useState, useEffect, useContext, Fragment } from 'react'
import { deletePolicyService } from 'services/policies/deletePolicy'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { StaticContext } from 'utils/context/staticContext'
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

    const context = useContext(StaticContext)

    const handleDeletePolicy = (value:string) => {
        deletePolicyService(context, value)
        updatePolicy()
    }

    const updatePolicy = () => {
        getAllPoliciesService(context).then((res:IPolicy[]) => {
            setPolicies(res.map((item:IPolicy) => {
                return {
                    label : item.policyId,
                    value : item.policyId,
                    text: JSON.stringify(item, undefined, 4)
                }
            }))
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        updatePolicy()
    }, [])
    
    return (
        <Fragment>
            <SelectWithTextArea path={path} tab="policies" name="policy" values={policies} deleteFunction={handleDeletePolicy} />
        </Fragment>
    )
}