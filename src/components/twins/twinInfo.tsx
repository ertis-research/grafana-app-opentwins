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
    section?: string
}
enum Sections {
    information = "information",
    children = "children",
    simulations = "simulations",
    agents = "agents",
    others = "others",
}

export function TwinInfo({ path, id, meta, section }: Parameters) {

    const [selected, setSelected] = useState<string>((section !== undefined) ? section : Sections.information);
    const [twinInfo, setTwinInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })

    const context = useContext(StaticContext)

    const getComponent = () => {
        switch (selected) {
            case Sections.children:
                return <ListChildrenTwin path={path} id={id} meta={meta} />
            case Sections.simulations:
                return <SimulationList path={path} id={id} meta={meta} twinInfo={twinInfo} />
            case Sections.agents:
                return <OtherFunctionsTwin path={path} id={id} meta={meta} />
            case Sections.others:
                return <OtherFunctionsTwin path={path} id={id} meta={meta} />
            default:
                return <InformationTwin path={path} twinInfo={twinInfo} meta={meta} />
        }
    }

    const getTwinInfo = () => {
        getTwinService(context, id).then(res => {
            setTwinInfo(res)
            console.log("res", res)
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        getTwinInfo()
    }, [])

    useEffect(() => {
        if (section !== undefined) {
            setSelected(section)
        } else {
            setSelected(Sections.information)
        }
    }, [section])

    useEffect(() => {
        getTwinInfo()
    }, [id])

    useEffect(() => {
        getTwinInfo()
    }, [selected])

    return (
        <Fragment>
            <InfoHeader path={path} thing={twinInfo} isType={false} sections={Object.values(Sections)} selected={selected} setSelected={setSelected} funcDelete={deleteTwinService} funcDeleteChildren={deleteTwinWithChildrenService} />
            <hr />
            {getComponent()}
        </Fragment>
    )
}

