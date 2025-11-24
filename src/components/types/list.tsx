import React from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { deleteTypeService, getAllTypesService } from 'services/TypesService'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListTypes({ path, meta }: Parameters) {

    return <MainList 
            path={path} 
            meta={meta} 
            isType={true} 
            funcThings={() => getAllTypesService()} 
            funcDelete={deleteTypeService}
        />

}
