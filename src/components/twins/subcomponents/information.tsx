import React from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { InformationThing } from 'components/auxiliary/dittoThing/list/info'

interface parameters {
    path : string
    twinInfo : IDittoThing
    meta : AppPluginMeta<KeyValue<any>>
}

export function InformationTwin ({path, twinInfo, meta} : parameters) {
    return <InformationThing
        path = {path}
        meta = {meta}
        thingInfo = {twinInfo}
        isType = {false}
    />
}