import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React from 'react'
import { createOrUpdateTwinToBeChildService } from 'services/twins/children/createOrUpdateTwinToBeChildService'
import { createOrUpdateTwinService } from 'services/twins/crud/createOrUpdateTwinService'
import { createTwinFromTypeService } from 'services/types/createTwinFromTypeService'
import { IStaticContext } from 'utils/context/staticContext'
import { IDittoThingData } from 'utils/interfaces/dittoThing'

interface parameters {
    path : string
    id ?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const CreateFormTwin = ({ path, meta, id } : parameters) => {

    if (id !== undefined) {
        const handleCreateChildren = (context:IStaticContext, thingId : string, data?:IDittoThingData) => {
            return createOrUpdateTwinToBeChildService(context, id, thingId, data)
        }
        const handleCreateChildrenByType = (context:IStaticContext, thingId : string, typeId : string, data?:IDittoThingData) => {
            return createTwinFromTypeService(context, thingId, typeId, data).then(() => 
                createOrUpdateTwinToBeChildService(context, id, thingId)
            )
        }
        return <ThingForm path={path} meta={meta} parentId={id} isType={false} funcFromZero={handleCreateChildren} funcFromType={handleCreateChildrenByType}/>
    
    } else {
        const handleCreateNew = (context:IStaticContext, thingId : string, data:IDittoThingData ) => {
            return createOrUpdateTwinService(context, thingId, data)
        }
        const handleCreateNewByType = (context:IStaticContext, thingId : string, typeId : string, data?:IDittoThingData) => {
            return createTwinFromTypeService(context, thingId, typeId, data)
        }
        return <ThingForm path={path} meta={meta} isType={false} funcFromZero={handleCreateNew} funcFromType={handleCreateNewByType}/>
    
    }

}