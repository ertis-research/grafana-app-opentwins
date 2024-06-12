import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React, { useContext } from 'react'
import { deletePolicyService } from 'services/policies/deletePolicy'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { getPolicyByIdService } from 'services/policies/getPolicyByIdService'
import { Roles } from 'utils/auxFunctions/auth'
import { StaticContext } from 'utils/context/staticContext'

interface Parameters {
    path: string
}

export const ListPolicies = ({path}: Parameters) => {

    const context = useContext(StaticContext)

    const updatePolicy = (setObjects: any, thenFunction?: any) => {
        getAllPoliciesService(context).then((res: string[]) => {
            setObjects(res.map((item: string) => {
                return {
                    label : item,
                    value : item
                }
            }))
            if(thenFunction) {thenFunction()}
        }).catch(() => {
            console.log("error")
            if(thenFunction) {thenFunction()}
        })
    }

    const getPolicy = (id: string) => {
        return getPolicyByIdService(context, id)
    }

    const deletePolicy = (id: string) => {
        return deletePolicyService(context, id)
    }

    return (
        <SelectWithTextArea 
            path={path}
            name="policy" 
            getByIdFunc={getPolicy}
            getAllFunc={updatePolicy}
            deleteFunc={deletePolicy}
            disableCreate={true}
            minRole={Roles.EDITOR}
        />
    )
}
