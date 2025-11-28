import React, { useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { AgentsList } from 'components/Agents/List/AgentsList'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListAgentsTwin({ path, id, meta }: Parameters) {

    //const context = useContext(StaticContext)

    useEffect(() => {
    }, [id])

    return <AgentsList path={path} meta={meta} twinId={id}/>

}
