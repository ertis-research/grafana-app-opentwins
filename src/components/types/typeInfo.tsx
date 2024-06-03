import React, { useState, useEffect, useContext, Fragment } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { FilterPill, useTheme2 } from '@grafana/ui'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { StaticContext } from 'utils/context/staticContext'
import { capitalize, defaultIfNoExist } from 'utils/auxFunctions/general'
import { InformationType } from './subcomponents/information'
import { getTypeService } from 'services/types/crud/getTypeService'
import { ButtonsInfo } from 'components/auxiliary/dittoThing/form/subcomponents/buttonsInfo'
import { deleteTypeService } from 'services/types/crud/deleteTypeService'
import { HierarchyType } from './subcomponents/hierarchy'


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

    const context = useContext(StaticContext)

    const getComponent = () => {
        switch (selected) {
            case Sections.information:
                return <InformationType path={path} twinInfo={typeInfo} meta={meta} />
            case Sections.hierarchy:
                return <HierarchyType path={path} id={id} meta={meta} />
            default:
                return <div>Default</div>
        }
    }

    const getTypeInfo = () => {
        getTypeService(context, id).then(res => {
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

    const IfImage = (typeInfo.attributes !== undefined && typeInfo.attributes.hasOwnProperty("image") && typeInfo.attributes.image) ?
        <img src={defaultIfNoExist(typeInfo.attributes, "image", '')} width='100px' height='100px' style={{ objectFit: 'cover' }} />
        : <div></div>

    return (
        <Fragment>
            <div className='headerInfo'>
                <div className='div1'>
                    <div className='responsiveImage'>
                        {IfImage}
                        <div className='responsiveTextHeader'>
                            <h3 style={{ marginBottom: '0px' }}>{defaultIfNoExist(typeInfo.attributes, "name", typeInfo.thingId)}</h3>
                            <h5 style={{ marginBottom: '0px', color: useTheme2().colors.text.secondary }}>{typeInfo.thingId}</h5>
                        </div>
                    </div>
                </div>
                <div className='div2'>
                    <div style={{ display: 'block' }}>
                        <div style={{ display: 'flex' }}>
                            {Object.values(Sections).map((item) => (
                                <div style={{ marginLeft: '2px', marginRight: '2px' }}>
                                    <FilterPill key={item} label={capitalize(item)} selected={item === selected} onClick={() => {
                                        history.pushState(null, "", path + "&mode=check&id=" + id + "&section=" + item)
                                        setSelected(item)
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='div3'> 
                    <ButtonsInfo path={path} thingId={typeInfo.thingId} isType={true} funcDelete={deleteTypeService} />
                </div>
            </div>
            {getComponent()}
        </Fragment>
    )
}
