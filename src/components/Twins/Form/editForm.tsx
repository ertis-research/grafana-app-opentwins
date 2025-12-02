import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/Things/Form/ThingForm'
import React, { useEffect, useState } from 'react'
import { createOrUpdateTwinService, getTwinService } from 'services/TwinsService'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const EditFormTwin = ({ path, meta, id }: Parameters) => {

    const [twinInfo, setTwinInfo] = useState<IDittoThing>()

    const handleEditTwin = (twinId: string, data: IDittoThingData) => {
        return createOrUpdateTwinService(twinId, data)
    }

    useEffect(() => {
        getTwinService(id).then((info: IDittoThing) => {
            setTwinInfo(info)
        })
    }, [id])

    useEffect(() => {
    }, [twinInfo])
    
    console.log(twinInfo)

    return (twinInfo) ? <ThingForm meta={meta} thingToEdit={twinInfo} isType={false} funcFromZero={handleEditTwin}/>
        : <div></div>
}
