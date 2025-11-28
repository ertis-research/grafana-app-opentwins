import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
// 1. Eliminamos locationService, usamos hooks de Router
import { useHistory, useLocation } from 'react-router-dom' 

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
    const history = useHistory();
    const location = useLocation();

    const [selected, setSelectedState] = useState<string>(section || Sections.information);
    const [twinInfo, setTwinInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)

    const context = useContext(StaticContext)

    const pluginBase = location.pathname.split('/twins')[0];
    const absolutePath = `${pluginBase}/${path}`; // Ejemplo: /a/mi-plugin/twins

    // --- FUNCIÓN RESTful PARA CAMBIAR TABS ---
    const handleTabChange = (newSection: string) => {
        setSelectedState(newSection);
        
        // Navegamos a: /a/mi-plugin/twins/{id}/{section}
        history.push(`${absolutePath}/${id}/${newSection}`);
    };

    const getComponent = () => {
        switch (selected) {
            case Sections.children:
                return <ListChildrenTwin path={absolutePath} id={id} meta={meta} />
            
            case Sections.simulations:
                return <SimulationList id={id} meta={meta} twinInfo={twinInfo} />
            
            case Sections.agents:
                if (context.agent_endpoint?.trim()) {
                    return <ListAgentsTwin path={absolutePath} id={id} meta={meta} />
                }
                return <div style={{ padding: 20 }}>No agent endpoint configured</div>; 

            case Sections.others:
                if (isEditor(userRole)) {
                    return <OtherFunctionsTwin path={absolutePath} id={id} meta={meta} />
                }
                return <div style={{ padding: 20 }}>Unauthorized</div>;

            case Sections.information:
            default:
                return <InformationTwin path={absolutePath} twinInfo={twinInfo} meta={meta} />
        }
    }

    const getTwinInfo = () => {
        getTwinService(id)
            .then(res => setTwinInfo(res))
            .catch(err => console.error("Error fetching twin:", err))
    }

    // 1. Carga inicial
    useEffect(() => {
        getCurrentUserRole().then((role: string) => setUserRole(role))
    }, [])

    // 2. Sincronizar URL -> Estado (Navegación Atrás/Adelante)
    useEffect(() => {
        if (section && section !== selected) {
            setSelectedState(section)
        } else if (!section && selected !== Sections.information) {
            // Si la URL es /twins/123 (sin sección), volver a info
            setSelectedState(Sections.information);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])

    // 3. Cargar datos del Twin (Solo al cambiar ID)
    useEffect(() => {
        getTwinInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const filter = (sect: string) => 
        (sect !== Sections.agents || !!context.agent_endpoint?.trim()) && 
        (sect !== Sections.others || isEditor(userRole))

    return (
        <Fragment>
            <InfoHeader 
                path={absolutePath} 
                thing={twinInfo} 
                isType={false} 
                sections={Object.values(Sections).filter(filter)} 
                selected={selected} 
                setSelected={handleTabChange} // Nueva función con history.push
                funcDelete={deleteTwinService} 
                funcDeleteChildren={deleteTwinWithChildrenService} 
            />
            {getComponent()}
        </Fragment>
    )
}
