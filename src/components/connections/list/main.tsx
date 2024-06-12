import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React, { useContext } from 'react'
import { deleteConnectionByIdService } from 'services/connections/deleteConnectionByIdService'
import { getAllConnectionIdsService } from 'services/connections/getAllConnectionsService'
import { getConnectionByIdService } from 'services/connections/getConnectionByIdService'
import { Roles } from 'utils/auxFunctions/auth'
import { StaticContext } from 'utils/context/staticContext'
import { ExtraButtonsConnection } from '../extraButtons'

interface Parameters {
    path: string
}

export const ListConnections = ({path}: Parameters) => {

    const context = useContext(StaticContext)

    const updateConnections = (setObjects: any, thenFunction?: any) => {
        getAllConnectionIdsService(context).then((res: Array<{id: string, name: string}>) => {
            setObjects(res.map(({id, name}: {id: string, name: string}) => {
                return {
                    label : name,
                    value : id
                }
            }))
            if(thenFunction) {thenFunction()}
        }).catch(() => {
            console.log("error")
            if(thenFunction) {thenFunction()}
        })
    }

    const getConnection = (id: string) => {
        return getConnectionByIdService(context, id)
    }

    const deleteConnection = (id: string) => {
        return deleteConnectionByIdService(context, id)
    }
    
    return (
        <SelectWithTextArea 
            path={path}
            name="connection" 
            getByIdFunc={getConnection}
            getAllFunc={updateConnections}
            deleteFunc={deleteConnection}
            ExtraButtonComponent={ExtraButtonsConnection}
            minRole={Roles.EDITOR}
        />
    )
    
}
