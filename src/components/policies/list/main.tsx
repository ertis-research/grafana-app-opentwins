import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React, { useState, useEffect, useContext, Fragment } from 'react'
import { deletePolicyService } from 'services/policies/deletePolicy'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { getPolicyByIdService } from 'services/policies/getPolicyByIdService'
import { StaticContext } from 'utils/context/staticContext'
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

    const getPolicy = (id:string) => {
        return getPolicyByIdService(context, id)
    }

    const updatePolicy = () => {
        getAllPoliciesService(context).then((res:string[]) => {
            setPolicies(res.map((item:string) => {
                return {
                    label : item,
                    value : item,
                    text: ""
                }
            }))
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        updatePolicy()
    }, [])

    useEffect(() => {
        updatePolicy()
    }, [policies])
    
    return (
        <Fragment>
            <SelectWithTextArea path={path} tab="policies" name="policy" values={policies} deleteFunction={handleDeletePolicy} getFunction={getPolicy} />
        </Fragment>
    )
}