import React, { useState, useEffect, Fragment } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { InformationType } from './subcomponents/information'
import { HierarchyType } from './subcomponents/hierarchy'
import { InfoHeader } from 'components/auxiliary/general/infoHeader'
import { deleteTypeService, getTypeService } from 'services/TypesService'


interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
    section?: string
}

enum Sections {
    information = "information",
    hierarchy = "hierarchy"
}

export function TypeInfo({ path, id, meta, section }: Parameters) {

    const [selected, setSelected] = useState<string>((section !== undefined) ? section : Sections.information);
    const [typeInfo, setTypeInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })

    const getComponent = () => {
        switch (selected) {
            case Sections.hierarchy:
                return <HierarchyType path={path} id={id} meta={meta} />
            default:
                return <InformationType path={path} twinInfo={typeInfo} meta={meta} />
        }
    }

    const getTypeInfo = () => {
        getTypeService(id).then(res => {
            setTypeInfo(res)
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        getTypeInfo()
    }, [])

    useEffect(() => {
        if (section !== undefined) {
            setSelected(section)
        } else {
            setSelected(Sections.information)
        }
    }, [section])

    useEffect(() => {
        getTypeInfo()
    }, [id])

    useEffect(() => {
    }, [selected])


    return (
        <Fragment>
            <InfoHeader path={path} thing={typeInfo} isType={true} sections={Object.values(Sections)} selected={selected} setSelected={setSelected} funcDelete={deleteTypeService}/>
            <hr/>
            {getComponent()}
        </Fragment>
    )

}
