import React, { useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { ListAgents } from 'components/agents/list'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListAgentsTwin({ path, id, meta }: Parameters) {

    //const context = useContext(StaticContext)

    useEffect(() => {
    }, [id])

    return <ListAgents path={path} meta={meta} twinId={id}/>

}
