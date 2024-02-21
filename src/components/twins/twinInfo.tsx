import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { FilterPill, HorizontalGroup, VerticalGroup } from '@grafana/ui'
import { ListChildrenTwin } from './subcomponents/children'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { StaticContext } from 'utils/context/staticContext'
import { getTwinService } from 'services/twins/crud/getTwinService'
import { defaultIfNoExist } from 'utils/auxFunctions/general'
import { InformationTwin } from './subcomponents/information'
import { SimulationList } from './subcomponents/simulationList'
import { OtherFunctionsTwin } from './subcomponents/otherFunctions'
import { ButtonsInfo } from 'components/auxiliary/dittoThing/form/subcomponents/buttonsInfo'
import { deleteTwinService } from 'services/twins/crud/deleteTwinService'
import { deleteTwinWithChildrenService } from 'services/twins/children/deleteTwinWithChildrenService'


interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

const Sections = {
    Information : "Information",
    Children : "Children", 
    Simulations : "Simulations",
    Other : "Other"
}

export function TwinInfo({path, id, meta}: Parameters) {

    const [selected, setSelected] = useState('Information');
    const [twinInfo, setTwinInfo] = useState<IDittoThing>({thingId: "", policyId: ""})

    const context = useContext(StaticContext)

    const getComponent = () => {
        switch (selected) {
            case Sections.Information:
                return <InformationTwin path={path} twinInfo={twinInfo} meta={meta}/>
            case Sections.Children:
                return <ListChildrenTwin path={path} id={id} meta={meta} />
            case Sections.Simulations:
                return <SimulationList path={path} id={id} twinInfo={twinInfo} meta={meta} />
            case Sections.Other:
                return <OtherFunctionsTwin path={path} id={id} meta={meta} />
            default:
                return <div>Default</div>
        }
    }

    const getTwinInfo = () => {
        getTwinService(context, id).then(res => {
            setTwinInfo(res)
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        getTwinInfo()
    }, [])

    useEffect(() => {
        getTwinInfo()
        setSelected(Sections.Information)
    }, [id])

    useEffect(() => {
    }, [selected])

    return (
        <Fragment>
            <div className='mb-3'>
                <HorizontalGroup justify='center'>
                    <VerticalGroup align='center' spacing='xs'>
                        <h3>{defaultIfNoExist(twinInfo.attributes, "name", twinInfo.thingId)}</h3>
                        <h5>{twinInfo.thingId}</h5>
                    </VerticalGroup>
                </HorizontalGroup>
                <ButtonsInfo path={path} thingId={twinInfo.thingId} isType={false} funcDelete={deleteTwinService} funcDeleteChildren={deleteTwinWithChildrenService} />
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

