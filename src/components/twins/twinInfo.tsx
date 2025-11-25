import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { locationService } from '@grafana/runtime' // Importante para actualizar URL
// ... tus otros imports ...
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

    // Inicializar directamente con la prop para evitar parpadeo inicial
    const [selected, setSelectedState] = useState<string>(section || Sections.information);
    const [twinInfo, setTwinInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)

    const context = useContext(StaticContext)

    // FUNCIÓN SEGURA PARA CAMBIAR TABS
    // Esto actualiza el estado Y la URL de Grafana para que al recargar no se pierda la sección
    const handleTabChange = (newSection: string) => {
        setSelectedState(newSection);
        locationService.partial({ section: newSection }, true); 
    };

    const getComponent = () => {
        switch (selected) {
            case Sections.children:
                return <ListChildrenTwin path={path} id={id} meta={meta} />
            
            case Sections.simulations:
                return <SimulationList path={path} id={id} meta={meta} twinInfo={twinInfo} />
            
            case Sections.agents:
                if (context.agent_endpoint?.trim()) {
                    // Split path safe check
                    return <ListAgentsTwin path={path.split("?")[0]} id={id} meta={meta} />
                }
                // Si falla la condición, forzamos un retorno explícito o break
                return <div>No agent endpoint configured</div>; 

            case Sections.others:
                if (isEditor(userRole)) {
                    return <OtherFunctionsTwin path={path} id={id} meta={meta} />
                }
                return <div>Unauthorized</div>;

            case Sections.information:
            default:
                return <InformationTwin path={path} twinInfo={twinInfo} meta={meta} />
        }
    }

    const getTwinInfo = () => {
        getTwinService(id)
            .then(res => setTwinInfo(res))
            .catch(err => console.error("Error fetching twin:", err))
    }

    // 1. Carga inicial y User Role
    useEffect(() => {
        getCurrentUserRole().then((role: string) => setUserRole(role))
        // No necesitamos llamar a getTwinInfo aquí, el useEffect de [id] lo hará
    }, [])

    // 2. Sincronizar prop 'section' (URL) con estado interno
    useEffect(() => {
        if (section && section !== selected) {
            setSelectedState(section)
        }
    }, [section])

    // 3. Cargar datos del Twin SOLO si cambia el ID
    // ELIMINADO [selected] de las dependencias para evitar recargas innecesarias al cambiar de tab
    useEffect(() => {
        getTwinInfo()
    }, [id])


    const filter = (sect: string) => 
        (sect !== Sections.agents || !!context.agent_endpoint?.trim()) && 
        (sect !== Sections.others || isEditor(userRole))

    return (
        <Fragment>
            <InfoHeader 
                path={path} 
                thing={twinInfo} 
                isType={false} 
                sections={Object.values(Sections).filter(filter)} 
                selected={selected} 
                setSelected={handleTabChange} // Usamos nuestra función wrapper
                funcDelete={deleteTwinService} 
                funcDeleteChildren={deleteTwinWithChildrenService} 
            />
            {getComponent()}
        </Fragment>
    )
}
