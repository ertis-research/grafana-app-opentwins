import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/Things/Form/ThingForm'
import React, { useEffect, useState } from 'react'
import { createOrUpdateTypeService, getTypeService } from 'services/TypesService'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface Parameters {
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const EditFormType = ({ meta, id }: Parameters) => {

    const [typeInfo, setTypeInfo] = useState<IDittoThing>()

    const handleEditType = (twinId: string, data: IDittoThingData) => {
        return createOrUpdateTypeService(twinId, data)
    }

    useEffect(() => {
        getTypeService(id).then((info: IDittoThing) => {
            setTypeInfo(info)
        })
    }, [id])

    useEffect(() => {
    }, [typeInfo])
    
    console.log(typeInfo)

    return (typeInfo) ? <ThingForm meta={meta} thingToEdit={typeInfo} isType={true} funcFromZero={handleEditType}/>
        : <div></div>
}
