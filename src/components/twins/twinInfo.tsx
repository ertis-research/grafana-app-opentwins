import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { ListChildrenTwin } from './subcomponents/children'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { StaticContext } from 'utils/context/staticContext'
import { InformationTwin } from './subcomponents/information'
import { SimulationList } from './subcomponents/simulationList'
import { OtherFunctionsTwin } from './subcomponents/otherFunctions'
import { InfoHeader } from 'components/auxiliary/general/infoHeader'
import { ListAgentsTwin } from './subcomponents/agents'
import { getCurrentUserRole, isEditor, Roles } from 'utils/auxFunctions/auth'
import { deleteTwinService, getTwinService } from 'services/TwinsService'
import { deleteTwinWithChildrenService } from 'services/TwinsCompositionService'


interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
    section?: string
}
enum Sections {
    information = "information",
    children = "children",
    agents = "agents",
    simulations = "simulations",
    others = "others",
}

export function TwinInfo({ path, id, meta, section }: Parameters) {

    const [selected, setSelected] = useState<string>((section !== undefined) ? section : Sections.information);
    const [twinInfo, setTwinInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)

    const context = useContext(StaticContext)

    const getComponent = () => {
        switch (selected) {
            case Sections.children:
                return <ListChildrenTwin path={path} id={id} meta={meta} />
            case Sections.simulations:
                return <SimulationList path={path} id={id} meta={meta} twinInfo={twinInfo} />
            case Sections.agents:
                if (context.agent_endpoint !== undefined && context.agent_endpoint.trim() !== '') {
                    return <ListAgentsTwin path={path.split("?")[0]} id={id} meta={meta} />
                }
            case Sections.others:
                if(isEditor(userRole)){
                    return <OtherFunctionsTwin path={path} id={id} meta={meta} />
                }
            default:
                return <InformationTwin path={path} twinInfo={twinInfo} meta={meta} />
        }
    }

    const getTwinInfo = () => {
        getTwinService(context, id).then(res => {
            setTwinInfo(res)
        }).catch(() => console.log("error"))
    }

    useEffect(() => {
        getTwinInfo()
        getCurrentUserRole().then((role: string) => setUserRole(role))
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

    const filter = (section: string) => 
        (section !== Sections.agents || context.agent_endpoint.trim() !== '') 
        && (section !== Sections.others || isEditor(userRole))

    return (
        <Fragment>
            <InfoHeader path={path} thing={twinInfo} isType={false} sections={Object.values(Sections).filter(filter)} selected={selected} setSelected={setSelected} funcDelete={deleteTwinService} funcDeleteChildren={deleteTwinWithChildrenService} />
            <hr />
            {getComponent()}
        </Fragment>
    )
}

