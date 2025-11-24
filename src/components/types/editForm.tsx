import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React, { useEffect, useState } from 'react'
import { createOrUpdateTypeService, getTypeService } from 'services/TypesService'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const EditFormType = ({ path, meta, id }: Parameters) => {

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

    return (typeInfo) ? <ThingForm path={path} meta={meta} thingToEdit={typeInfo} isType={true} funcFromZero={handleEditType}/>
        : <div></div>
}
