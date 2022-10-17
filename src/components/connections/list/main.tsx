import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React, { useContext } from 'react'
import { deleteConnectionByIdService } from 'services/connections/deleteConnectionByIdService'
import { getAllConnectionIdsService } from 'services/connections/getAllConnectionsService'
import { getConnectionByIdService } from 'services/connections/getConnectionByIdService'
import { StaticContext } from 'utils/context/staticContext'
import { ExtraButtonsConnection } from '../extraButtons'

interface parameters {
    path : string
}

export const ListConnections = ({path} : parameters) => {

    const context = useContext(StaticContext)

    const updateConnections = (setObjects:any, thenFunction?:any) => {
        getAllConnectionIdsService(context).then((res:string[]) => {
            setObjects(res.map((item:string) => {
                return {
                    label : item,
                    value : item
                }
            }))
            if(thenFunction) thenFunction()
        }).catch(() => {
            console.log("error")
            if(thenFunction) thenFunction()
        })
    }

    const getConnection = (id:string) => {
        return getConnectionByIdService(context, id)
    }

    const deleteConnection = (id:string) => {
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
        />
    )
    
}