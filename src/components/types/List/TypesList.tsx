import React from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { ThingsList } from 'components/Things/List/ThingsList'
import { deleteTypeService, getAllTypesService } from 'services/TypesService'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function TypesList({ path, meta }: Parameters) {

    return <ThingsList 
            isType={true} 
            funcThings={() => getAllTypesService()} 
            funcDelete={deleteTypeService}
        />

}
