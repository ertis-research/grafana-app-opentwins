import React, { useContext, useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { StaticContext } from 'utils/context/staticContext'
import { deleteTwinWithChildrenService, getChildrenOfTwinService } from 'services/TwinsCompositionService'
import { deleteTwinService } from 'services/TwinsService'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListChildrenTwin({ path, id, meta }: Parameters) {

    const context = useContext(StaticContext)

    useEffect(() => {
    }, [id])

    return <MainList 
            path={path} 
            meta={meta} 
            isType={false} 
            funcThings={() => getChildrenOfTwinService(context, id)} 
            funcDelete={deleteTwinService} 
            funcDeleteChildren={deleteTwinWithChildrenService} 
            parentId={id}
            iniCompactMode={true}
        />

}
