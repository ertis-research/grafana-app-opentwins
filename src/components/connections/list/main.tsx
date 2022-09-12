import { SelectWithTextArea } from 'components/auxiliary/general/selectWithTextArea'
import React, { useState, useEffect, useContext, Fragment } from 'react'
import { getAllConnectionIdsService } from 'services/connections/getAllConnectionsService'
import { getConnectionByIdService } from 'services/connections/getConnectionByIdService'
import { StaticContext } from 'utils/context/staticContext'
import { ISelect } from 'utils/interfaces/select'
/*import { List } from '@grafana/ui';
import { ControlledCollapse } from '@grafana/ui';
import { Select, TextArea, Button } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';*/

interface parameters {
    path : string
}

export const ListConnections = ({path} : parameters) => {

    const [connections, setConnections] = useState<ISelect[]>([])

    const context = useContext(StaticContext)

    const handleDeleteConnection = (value:string) => {
        //deletePolicyService(context, value)
        updateConnections()
    }

    const getConnection = (id:string) => {
        return getConnectionByIdService(context, id)
    }

    const updateConnections = () => {
        getAllConnectionIdsService(context).then((res:string[]) => {
            setConnections(res.map((id:string) => {
                return {
                    label : id,
                    value : id
                }
            }))
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        updateConnections()
    }, [])
    
    return (
        <Fragment>
            <SelectWithTextArea path={path} tab="connections" name="connection" values={connections} deleteFunction={handleDeleteConnection} getFunction={getConnection}/>
        </Fragment>
    )
}