import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React, { useContext } from 'react'
import { createOrUpdateTypeToBeChildService } from 'services/types/children/createOrUpdateTypeToBeChildService'
import { createOrUpdateTypeService } from 'services/types/crud/createOrUpdateTypeService'
import { StaticContext } from 'utils/context/staticContext'
import { IDittoThingData } from 'utils/interfaces/dittoThing'

interface parameters {
    path : string
    id ?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const CreateFormType = ({ path, meta, id } : parameters) => {

    const context = useContext(StaticContext)

    if (id !== undefined) {
        const handleCreateChildren = (thingId : string, data?:IDittoThingData) => {
            return createOrUpdateTypeToBeChildService(context, id, thingId, data)
        }
        return <ThingForm path={path} meta={meta} parentId={id} isType={true} funcFromZero={handleCreateChildren}/>

    } else {
        const handleCreateNew = (thingId : string, data:IDittoThingData ) => {
            return createOrUpdateTypeService(context, thingId, data)
        }
        return <ThingForm path={path} meta={meta} isType={true} funcFromZero={handleCreateNew}/>
    }

}