import React from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { InformationThing } from 'components/auxiliary/dittoThing/list/info'

interface Parameters {
    path: string
    twinInfo: IDittoThing
    meta: AppPluginMeta<KeyValue<any>>
}

export function InformationType ({path, twinInfo, meta}: Parameters) {
    return <InformationThing
        path = {path}
        meta = {meta}
        thingInfo = {twinInfo}
        isType = {true}
    />
}
