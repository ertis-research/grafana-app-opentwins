import React, {useContext} from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { StaticContext } from 'utils/context/staticContext'
import { deleteTwinService, getAllRootTwinsService } from 'services/TwinsService'
import { deleteTwinWithChildrenService } from 'services/TwinsCompositionService'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListTwins({path, meta }: Parameters) {

    const context = useContext(StaticContext)

    return <MainList 
            path={path} 
            meta={meta} 
            isType={false} 
            funcThings={() => getAllRootTwinsService(context)} 
            funcDelete={deleteTwinService}
            funcDeleteChildren={deleteTwinWithChildrenService}
        />

}
