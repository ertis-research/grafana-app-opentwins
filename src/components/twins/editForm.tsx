import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ThingForm } from 'components/auxiliary/dittoThing/form/main'
import React, { useEffect, useContext, useState } from 'react'
import { createOrUpdateTwinService } from 'services/twins/crud/createOrUpdateTwinService'
import { getTwinService } from 'services/twins/crud/getTwinService'
import { StaticContext } from 'utils/context/staticContext'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface parameters {
    path : string
    id : string
    meta: AppPluginMeta<KeyValue<any>>
}

export const EditFormTwin = ({ path, meta, id } : parameters) => {

    const [twinInfo, setTwinInfo] = useState<IDittoThing>()

    const context = useContext(StaticContext)

    const handleEditTwin = (twinId:string, data:IDittoThingData) => {
        return createOrUpdateTwinService(context, twinId, data)
    }

    useEffect(() => {
        getTwinService(context, id).then((info:IDittoThing) => {
            setTwinInfo(info)
        })
    }, [id])

    useEffect(() => {
    }, [twinInfo])
    
    console.log(twinInfo)

    return (twinInfo) ? <ThingForm path={path} meta={meta} thingToEdit={twinInfo} isType={false} funcFromZero={handleEditTwin}/>
        : <div></div>
}