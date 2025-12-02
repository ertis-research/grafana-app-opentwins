import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/Things/Form/ThingForm'
import React from 'react'
import { createOrUpdateTypeToBeChildService } from 'services/TypesCompositionService'
import { createOrUpdateTypeService } from 'services/TypesService'
import { IDittoThingData } from 'utils/interfaces/dittoThing'

interface Parameters {
    id?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const CreateFormType = ({ meta, id }: Parameters) => {

    if (id !== undefined) {
        const handleCreateChildren = (thingId: string, data: IDittoThingData, num?: number) => {
            return createOrUpdateTypeToBeChildService(id, thingId, (num) ? num : 1, data)
        }
        return <ThingForm meta={meta} parentId={id} isType={true} funcFromZero={handleCreateChildren}/>

    } else {
        const handleCreateNew = (thingId: string, data: IDittoThingData) => {
            return createOrUpdateTypeService(thingId, data)
        }
        return <ThingForm meta={meta} isType={true} funcFromZero={handleCreateNew}/>
    }

}
