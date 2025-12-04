import React, { Fragment, useState, useEffect, useContext } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { useHistory, useLocation } from 'react-router-dom' 

// Interfaces & Context
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { StaticContext } from 'utils/context/staticContext'

// Services
import { deleteTwinService, getTwinService, getTwinsPaginatedService } from 'services/TwinsService'
import { deleteTwinWithChildrenService } from 'services/TwinsCompositionService'

// UI Components
import { ThingHeader } from 'components/Things/Info/subcomponents/ThingHeader'
import { SimulationList } from 'components/Simulations/List/SimulationsList'
import { ThingInfo } from 'components/Things/Info/ThingInfo'
import { ThingsList } from 'components/Things/List/ThingsList'
import { AgentsList } from 'components/Agents/List/AgentsList'


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
    simulations = "simulations"
}

export function TwinInfo({ path, id, meta, section }: Parameters) {
    const history = useHistory();
    const location = useLocation();

    // Estado
    const [selected, setSelectedState] = useState<string>(section || Sections.information);
    const [twinInfo, setTwinInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })

    const context = useContext(StaticContext)

    // Rutas
    const pluginBase = location.pathname.split('/twins')[0];
    const absolutePath = `${pluginBase}/${path}`;

    // --- Efectos ---


    // 2. Sincronizar URL -> Estado (Navegación Atrás/Adelante)
    useEffect(() => {
        if (section && section !== selected) {
            setSelectedState(section)
        } else if (!section && selected !== Sections.information) {
            // Si la URL es /twins/123 (sin sección), volver a info
            setSelectedState(Sections.information);
        }
    }, [section])

    // 3. Cargar datos del Twin (Solo al cambiar ID)

    const getTwinInfoData = () => {
        getTwinService(id)
            .then(res => setTwinInfo(res))
            .catch(err => console.error("Error fetching twin:", err))
    }

    const handleTabChange = (newSection: string) => {
        setSelectedState(newSection);
        history.push(`${absolutePath}/${id}/${newSection}`);
    };

    const filterTabs = (sect: string) => 
        (sect !== Sections.agents || !!context.agent_endpoint?.trim())

    useEffect(() => {
        getTwinInfoData()
    }, [id])
    // --- Renderizado de contenido ---

    const getComponent = () => {
        switch (selected) {
            case Sections.children:
                return (
                    <ThingsList 
                        isType={false} 
                        funcThings={getTwinsPaginatedService} 
                        funcDelete={deleteTwinService} 
                        funcDeleteChildren={deleteTwinWithChildrenService} 
                        parentId={id}
                        iniCompactMode={true}
                    />
                );
            
            case Sections.simulations:
                return <SimulationList id={id} meta={meta} twinInfo={twinInfo} />;
            
            case Sections.agents:
                if (context.agent_endpoint?.trim()) {
                    return <AgentsList twinId={id}/>;
                }
                return <div style={{ padding: 20 }}>No agent endpoint configured</div>; 

            case Sections.information:
            default:
                return (
                    <ThingInfo thingInfo={twinInfo}/>
                );
        }
    }

    return (
        <Fragment>
            <ThingHeader 
                thing={twinInfo} 
                isType={false} 
                sections={Object.values(Sections).filter(filterTabs)} 
                selected={selected} 
                setSelected={handleTabChange}
                funcDelete={deleteTwinService} 
                funcDeleteChildren={deleteTwinWithChildrenService} 
                enableCopy={true}
            />
            {getComponent()}
        </Fragment>
    )
}
