import React, { useState, useEffect, Fragment } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { locationService } from '@grafana/runtime' // Importante para la URL
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

export function TypeInfo({ path, id, meta, section }: Parameters) {

    // Inicialización directa para evitar parpadeos
    const [selected, setSelectedState] = useState<string>(section || Sections.information);
    const [typeInfo, setTypeInfo] = useState<IDittoThing>({ thingId: "", policyId: "" })

    // FUNCIÓN SEGURA PARA CAMBIAR TABS
    // Actualiza estado local + URL de Grafana
    const handleTabChange = (newSection: string) => {
        setSelectedState(newSection);
        // Esto actualiza solo el parámetro 'section' en la URL sin recargar la página
        locationService.partial({ section: newSection }, true);
    };

    const getComponent = () => {
        switch (selected) {
            case Sections.hierarchy:
                return <HierarchyType path={path} id={id} meta={meta} />
            
            case Sections.information:
            default:
                // default case asegura que siempre se muestre algo
                return <InformationType path={path} twinInfo={typeInfo} meta={meta} />
        }
    }

    const getTypeInfo = () => {
        getTypeService(id)
            .then(res => setTypeInfo(res))
            .catch(err => console.error("Error fetching type:", err))
    }

    // 1. Sincronizar prop 'section' con estado interno (Nav atrás/adelante)
    useEffect(() => {
        if (section && section !== selected) {
            setSelectedState(section)
        }
    }, [section])

    // 2. Cargar datos SOLO cuando cambia el ID
    // Quitamos 'selected' y [] redundantes
    useEffect(() => {
        getTypeInfo()
    }, [id])

    return (
        <Fragment>
            <InfoHeader 
                path={path} 
                thing={typeInfo} 
                isType={true} 
                sections={Object.values(Sections)} 
                selected={selected} 
                setSelected={handleTabChange} // Pasamos la función inteligente
                funcDelete={deleteTypeService}
            />
            {getComponent()}
        </Fragment>
    )
}
