import React, { useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { ListChildren } from 'components/auxiliary/dittoThing/list/children'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListChildrenType({ path, id, meta }: Parameters) {

    //const context = useContext(StaticContext)

    useEffect(() => {
    }, [id])

    return <ListChildren
                path={path}
                meta={meta}
                isType={true}
                id={id}
            />

}
