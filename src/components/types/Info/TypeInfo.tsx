import React, { useState, useEffect, Fragment } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { useHistory, useLocation } from 'react-router-dom' 

// Interfaces & Services
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { deleteTypeService, getTypeService } from 'services/TypesService'

// UI Components
import { ThingHeader } from 'components/Things/Info/subcomponents/ThingHeader'
import { ThingInfo } from 'components/Things/Info/ThingInfo'

// External Components (Asumimos que este archivo existe y contiene lógica compleja)
import { TypeHierarchy } from './subcomponents/TypeHierarchy'

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
    const history = useHistory();
    const location = useLocation();

    // Estado
    const [selected, setSelectedState] = useState<string>(section || Sections.information);
    const [typeInfo, setTypeInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })

    // Rutas
    // Calculamos la base una vez para usarla en navegación
    const pluginBase = location.pathname.split('/types')[0];

    // --- Funciones ---

    const getTypeInfoData = () => {
        getTypeService(id)
            .then(res => setTypeInfo(res))
            .catch(err => console.error("Error fetching type:", err))
    }

    const handleTabChange = (newSection: string) => {
        setSelectedState(newSection);
        history.push(`${pluginBase}/types/${id}/${newSection}`);
    };

    // --- Efectos ---

    // 1. Sincronizar prop 'section' con estado interno (Navegación del browser)
    useEffect(() => {
        if (section && section !== selected) {
            setSelectedState(section)
        } else if (!section && selected !== Sections.information) {
             // Si la URL es /types/123 (sin sección), volver a info por defecto
            setSelectedState(Sections.information);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])

    // 2. Cargar datos SOLO cuando cambia el ID
    useEffect(() => {
        getTypeInfoData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    // --- Renderizado ---

    const getComponent = () => {
        switch (selected) {
            case Sections.hierarchy:
                return <TypeHierarchy id={id} />
            
            case Sections.information:
            default:
                return (
                    <ThingInfo thingInfo={typeInfo} isType={true}/>
                );
        }
    }

    return (
        <Fragment>
            <ThingHeader 
                thing={typeInfo} 
                isType={true} 
                sections={Object.values(Sections)} 
                selected={selected} 
                setSelected={handleTabChange} 
                funcDelete={deleteTypeService}
            />
            {getComponent()}
        </Fragment>
    )
}