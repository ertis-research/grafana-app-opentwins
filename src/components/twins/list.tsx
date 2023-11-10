import React, {useContext} from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { getAllRootTwinsService } from 'services/twins/getAllRootTwinsService'
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { deleteTwinService } from 'services/twins/crud/deleteTwinService'
import { deleteTwinWithChildrenService } from 'services/twins/children/deleteTwinWithChildrenService'
import { StaticContext } from 'utils/context/staticContext'

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
