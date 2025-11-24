import React from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { deleteTwinService, getAllRootTwinsService } from 'services/TwinsService'
import { deleteTwinWithChildrenService } from 'services/TwinsCompositionService'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListTwins({path, meta }: Parameters) {

    return <MainList 
            path={path} 
            meta={meta} 
            isType={false} 
            funcThings={() => getAllRootTwinsService()} 
            funcDelete={deleteTwinService}
            funcDeleteChildren={deleteTwinWithChildrenService}
        />

}
