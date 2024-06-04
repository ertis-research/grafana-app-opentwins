import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ListChildrenTwin } from './subcomponents/children'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { StaticContext } from 'utils/context/staticContext'
import { getTwinService } from 'services/twins/crud/getTwinService'
import { InformationTwin } from './subcomponents/information'
import { SimulationList } from './subcomponents/simulationList'
import { OtherFunctionsTwin } from './subcomponents/otherFunctions'
import { deleteTwinService } from 'services/twins/crud/deleteTwinService'
import { deleteTwinWithChildrenService } from 'services/twins/children/deleteTwinWithChildrenService'
import { InfoHeader } from 'components/auxiliary/general/infoHeader'


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
            <InfoHeader path={path} thing={twinInfo} isType={false} sections={Object.values(Sections)} selected={selected} setSelected={setSelected} funcDelete={deleteTwinService} funcDeleteChildren={deleteTwinWithChildrenService}/>
            <hr/>
            {getComponent()}
        </Fragment>
    )
}

