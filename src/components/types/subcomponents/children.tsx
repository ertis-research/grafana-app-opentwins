import React, { useContext, useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { StaticContext } from 'utils/context/staticContext'
import { deleteTypeService } from 'services/types/crud/deleteTypeService'
import { getChildrenOfTypeService } from 'services/types/children/getChildrenOfTypeService'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListChildrenType({ path, id, meta }: Parameters) {

    const context = useContext(StaticContext)

    useEffect(() => {
    }, [id])

    return <MainList 
            path={path} 
            meta={meta} 
            isType={true} 
            funcThings={() => getChildrenOfTypeService(context, id)} 
            funcDelete={deleteTypeService}
            parentId={id}
        />

}
