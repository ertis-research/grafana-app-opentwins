import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React, { useEffect } from 'react'
import { createOrUpdateTwinToBeChildService } from 'services/TwinsCompositionService'
import { createOrUpdateTwinService } from 'services/TwinsService'
import { createTwinFromTypeService } from 'services/TypesService'
import { IDittoThingData } from 'utils/interfaces/dittoThing'

interface Parameters {
    path: string
    id?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const CreateFormTwin = ({ path, meta, id }: Parameters) => {

    useEffect(() => {
    }, [id])

    if (id !== undefined) {
        const handleCreateChildren = (thingId: string, data?: IDittoThingData) => {
            return createOrUpdateTwinToBeChildService(id, thingId, data)
        }
        const handleCreateChildrenByType = (thingId: string, typeId: string, data?: IDittoThingData) => {
            return createTwinFromTypeService(thingId, typeId, data).then(() => 
                createOrUpdateTwinToBeChildService(id, thingId)
            )
        }
        return <ThingForm path={path} meta={meta} parentId={id} isType={false} funcFromZero={handleCreateChildren} funcFromType={handleCreateChildrenByType}/>
    
    } else {
        const handleCreateNew = (thingId: string, data: IDittoThingData ) => {
            return createOrUpdateTwinService(thingId, data)
        }
        const handleCreateNewByType = (thingId: string, typeId: string, data?: IDittoThingData) => {
            return createTwinFromTypeService(thingId, typeId, data)
        }
        return <ThingForm path={path} meta={meta} isType={false} funcFromZero={handleCreateNew} funcFromType={handleCreateNewByType}/>
    
    }

}
