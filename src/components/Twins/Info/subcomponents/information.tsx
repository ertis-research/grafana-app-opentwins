import React from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { ThingInfo } from 'components/Things/Info/ThingInfo'

interface Parameters {
    path: string
    twinInfo: IDittoThing
    meta: AppPluginMeta<KeyValue<any>>
}

export function InformationTwin ({path, twinInfo, meta}: Parameters) {
    return <ThingInfo
        path = {path}
        meta = {meta}
        thingInfo = {twinInfo}
        isType = {false}
    />
}
