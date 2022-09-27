import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React, { useContext, useEffect } from 'react'
import { createOrUpdateTwinToBeChildService } from 'services/twins/children/createOrUpdateTwinToBeChildService'
import { createOrUpdateTwinService } from 'services/twins/crud/createOrUpdateTwinService'
import { createTwinFromTypeService } from 'services/types/createTwinFromTypeService'
import { StaticContext } from 'utils/context/staticContext'
import { IDittoThingData } from 'utils/interfaces/dittoThing'

interface parameters {
    path : string
    id ?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const CreateFormTwin = ({ path, meta, id } : parameters) => {

    useEffect(() => {
    }, [id])
    

    const context = useContext(StaticContext)

    if (id !== undefined) {
        const handleCreateChildren = (thingId : string, data?:IDittoThingData) => {
            return createOrUpdateTwinToBeChildService(context, id, thingId, data)
        }
        const handleCreateChildrenByType = (thingId : string, typeId : string, data?:IDittoThingData) => {
            return createTwinFromTypeService(context, thingId, typeId, data).then(() => 
                createOrUpdateTwinToBeChildService(context, id, thingId)
            )
        }
        return <ThingForm path={path} meta={meta} parentId={id} isType={false} funcFromZero={handleCreateChildren} funcFromType={handleCreateChildrenByType}/>
    
    } else {
        const handleCreateNew = (thingId : string, data:IDittoThingData ) => {
            return createOrUpdateTwinService(context, thingId, data)
        }
        const handleCreateNewByType = (thingId : string, typeId : string, data?:IDittoThingData) => {
            return createTwinFromTypeService(context, thingId, typeId, data)
        }
        return <ThingForm path={path} meta={meta} isType={false} funcFromZero={handleCreateNew} funcFromType={handleCreateNewByType}/>
    
    }

}