import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React from 'react'
import { deletePolicyService, getAllPoliciesService, getPolicyByIdService } from 'services/PoliciesService'
import { Roles } from 'utils/auxFunctions/auth'

interface Parameters {
    path: string
}

export const ListPolicies = ({path}: Parameters) => {

    const updatePolicy = (setObjects: any, thenFunction?: any) => {
        getAllPoliciesService().then((res: string[]) => {
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
        return getPolicyByIdService(id)
    }

    const deletePolicy = (id: string) => {
        return deletePolicyService(id)
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
