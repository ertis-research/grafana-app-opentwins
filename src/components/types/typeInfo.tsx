import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { FilterPill, HorizontalGroup, VerticalGroup } from '@grafana/ui'
import { ListChildrenType } from './subcomponents/children'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { StaticContext } from 'utils/context/staticContext'
import { defaultIfNoExist } from 'utils/auxFunctions/general'
import { InformationType } from './subcomponents/information'
import { getTypeService } from 'services/types/crud/getTypeService'
import { ButtonsInfo } from 'components/auxiliary/dittoThing/form/subcomponents/buttonsInfo'
import { deleteTypeService } from 'services/types/crud/deleteTypeService'
import { ListParentsType } from './subcomponents/parents'


interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

const Sections = {
    Information : "Information",
    Children : "Children",
    Parents : "Parents",
    Other : "Other"
}

export function TypeInfo({path, id, meta}: Parameters) {

    const [selected, setSelected] = useState('Information');
    const [typeInfo, setTypeInfo] = useState<IDittoThing>({thingId: "", policyId: ""})

    const context = useContext(StaticContext)

    const getComponent = () => {
        switch (selected) {
            case Sections.Information:
                return <InformationType path={path} twinInfo={typeInfo} meta={meta}/>
            case Sections.Children:
                return <ListChildrenType path={path} id={id} meta={meta} />
            case Sections.Parents:
                    return <ListParentsType path={path} id={id} meta={meta} />
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
        getTypeInfo()
        setSelected(Sections.Information)
    }, [id])

    useEffect(() => {
    }, [selected])

    return (
        <Fragment>
            <div className='mb-3'>
                <HorizontalGroup justify='center'>
                    <VerticalGroup align='center' spacing='xs'>
                        <h3>{defaultIfNoExist(typeInfo.attributes, "name", typeInfo.thingId)}</h3>
                        <h5>{typeInfo.thingId}</h5>
                    </VerticalGroup>
                </HorizontalGroup>
                <ButtonsInfo path={path} thingId={typeInfo.thingId} isType={true} funcDelete={deleteTypeService} />
            </div>
            <HorizontalGroup justify='center'>
                {Object.values(Sections).map((item) => (
                    <FilterPill key={item} label={item} selected={item === selected} onClick={() => setSelected(item)} />
                ))}
            </HorizontalGroup>
            <hr/>
            {getComponent()}
        </Fragment>
    )
}
