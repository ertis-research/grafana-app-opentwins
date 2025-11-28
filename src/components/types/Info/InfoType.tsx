import React, { useState, useEffect, Fragment } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
// 1. Importamos hooks de React Router
import { useHistory, useLocation } from 'react-router-dom' 
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { InformationType } from './subcomponents/information'
import { HierarchyType } from './subcomponents/hierarchy'
import { InfoHeader } from 'components/auxiliary/general/infoHeader'
import { deleteTypeService, getTypeService } from 'services/TypesService'

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

export function InfoType({ path, id, meta, section }: Parameters) {
    const history = useHistory();
    const location = useLocation();

    const [selected, setSelectedState] = useState<string>(section || Sections.information);
    const [typeInfo, setTypeInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })


    const handleTabChange = (newSection: string) => {
        setSelectedState(newSection);

        const pluginBase = location.pathname.split('/types')[0];
        history.push(`${pluginBase}/types/${id}/${newSection}`);
    };

    const getComponent = () => {
        switch (selected) {
            case Sections.hierarchy:
                return <HierarchyType id={id} />
            
            case Sections.information:
            default:
                return <InformationType path={path} twinInfo={typeInfo} meta={meta} />
        }
    }

    const getTypeInfo = () => {
        getTypeService(id)
            .then(res => setTypeInfo(res))
            .catch(err => console.error("Error fetching type:", err))
    }

    // 1. Sincronizar prop 'section' con estado interno
    // Esto maneja cuando el usuario usa las flechas Atrás/Adelante del navegador
    useEffect(() => {
        // Si la URL cambia (section cambia), actualizamos el tab seleccionado
        if (section && section !== selected) {
            setSelectedState(section)
        } else if (!section && selected !== Sections.information) {
             // Si no hay section en la URL (ej: /types/123), volvemos a info por defecto
            setSelectedState(Sections.information);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])

    // 2. Cargar datos SOLO cuando cambia el ID
    useEffect(() => {
        getTypeInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <Fragment>
            <InfoHeader 
                path={path} 
                thing={typeInfo} 
                isType={true} 
                sections={Object.values(Sections)} 
                selected={selected} 
                setSelected={handleTabChange} // Usamos la nueva función
                funcDelete={deleteTypeService}
            />
            {getComponent()}
        </Fragment>
    )
}