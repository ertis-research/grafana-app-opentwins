import React, { useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { deleteTwinWithChildrenService, getChildrenOfTwinService } from 'services/TwinsCompositionService'
import { deleteTwinService } from 'services/TwinsService'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListChildrenTwin({ path, id, meta }: Parameters) {

    useEffect(() => {
    }, [id])

    return <MainList 
            path={path} 
            meta={meta} 
            isType={false} 
            funcThings={() => getChildrenOfTwinService(id)} 
            funcDelete={deleteTwinService} 
            funcDeleteChildren={deleteTwinWithChildrenService} 
            parentId={id}
            iniCompactMode={true}
        />

}
