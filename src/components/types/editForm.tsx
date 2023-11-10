import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React, { useEffect, useContext, useState } from 'react'
import { createOrUpdateTypeService } from 'services/types/crud/createOrUpdateTypeService'
import { getTypeService } from 'services/types/crud/getTypeService'
import { StaticContext } from 'utils/context/staticContext'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const EditFormType = ({ path, meta, id }: Parameters) => {

    const [typeInfo, setTypeInfo] = useState<IDittoThing>()

    const context = useContext(StaticContext)

    const handleEditType = (twinId: string, data: IDittoThingData) => {
        return createOrUpdateTypeService(context, twinId, data)
    }

    useEffect(() => {
        getTypeService(context, id).then((info: IDittoThing) => {
            setTypeInfo(info)
        })
    }, [id])

    useEffect(() => {
    }, [typeInfo])
    
    console.log(typeInfo)

    return (typeInfo) ? <ThingForm path={path} meta={meta} thingToEdit={typeInfo} isType={true} funcFromZero={handleEditType}/>
        : <div></div>
}
