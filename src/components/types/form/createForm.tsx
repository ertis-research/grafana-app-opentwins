import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React from 'react'
import { createOrUpdateTypeToBeChildService } from 'services/types/children/createOrUpdateTypeToBeChildService'
import { createOrUpdateTypeService } from 'services/types/crud/createOrUpdateTypeService'
import { IStaticContext } from 'utils/context/staticContext'
import { IDittoThingData } from 'utils/interfaces/dittoThing'

interface parameters {
    path : string
    id ?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const CreateFormType = ({ path, meta, id } : parameters) => {

    if (id !== undefined) {
        const handleCreateChildren = (context:IStaticContext, thingId : string, data?:IDittoThingData) => {
            return createOrUpdateTypeToBeChildService(context, id, thingId, data)
        }
        return <ThingForm path={path} meta={meta} parentId={id} isType={true} funcFromZero={handleCreateChildren}/>

    } else {
        const handleCreateNew = (context:IStaticContext, thingId : string, data:IDittoThingData ) => {
            return createOrUpdateTypeService(context, thingId, data)
        }
        return <ThingForm path={path} meta={meta} isType={true} funcFromZero={handleCreateNew}/>
    }

}