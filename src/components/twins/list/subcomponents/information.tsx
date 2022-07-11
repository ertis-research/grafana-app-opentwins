import React from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Label, VerticalGroup } from '@grafana/ui'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { defaultIfNoExist } from 'utils/auxFunctions/general'

interface parameters {
    path : string
    twinInfo : IDittoThing
    meta : AppPluginMeta<KeyValue<any>>
    edit : boolean
}

export function InformationTwin ({path, twinInfo, meta} : parameters) {
    return (
        <VerticalGroup>
            <Label description="Name">{defaultIfNoExist(twinInfo.attributes, "name", "")}</Label>
            <Label description="ThingId">{twinInfo.thingId}</Label>
            <Label description="PolicyId">{twinInfo.policyId}</Label>
        </VerticalGroup>
    )
}