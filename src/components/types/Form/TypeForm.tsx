import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Spinner } from '@grafana/ui'
import { ThingForm } from 'components/Things/Form/ThingForm'
import React, { useEffect, useState, useCallback } from 'react'
import { createOrUpdateTypeToBeChildService } from 'services/TypesCompositionService'
import { createOrUpdateTypeService, getTypeService } from 'services/TypesService'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface TypeFormProps {
    /** Meta datos del plugin */
    meta: AppPluginMeta<KeyValue<any>>
    /** ID del Type si se está EDITANDO. Si es undefined, se asume modo CREACIÓN. */
    typeId?: string
    /** ID del Padre si se está creando un subtipo (Child). Solo aplica en modo CREACIÓN. */
    parentId?: string
}

export const TypeForm = ({ meta, typeId, parentId }: TypeFormProps) => {
    
    const [typeInfo, setTypeInfo] = useState<IDittoThing | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(!!typeId)

    // Cargar datos si estamos en modo Edición
    useEffect(() => {
        if (typeId) {
            setIsLoading(true)
            getTypeService(typeId)
                .then((info: IDittoThing) => {
                    setTypeInfo(info)
                })
                .catch((err) => {
                    console.error("Error fetching type data", err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [typeId])

    // Handler unificado para crear o editar
    // Nota: 'num' es opcional y específico para cuando se crea un hijo (cardinalidad)
    const handleOperation = useCallback((id: string, data: IDittoThingData, num?: number) => {
        
        // Caso 1: Edición de un Type existente
        if (typeId) {
            return createOrUpdateTypeService(id, data)
        }

        // Caso 2: Creación como hijo de otro Type (Composition)
        if (parentId) {
            // Si num viene definido lo usa, si no, por defecto es 1
            const cardinality = num !== undefined ? num : 1
            return createOrUpdateTypeToBeChildService(parentId, id, cardinality, data)
        }

        // Caso 3: Creación de un Type nuevo independiente
        return createOrUpdateTypeService(id, data)

    }, [typeId, parentId])

    if (isLoading) {
        return <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
            <Spinner size={20} />
        </div>
    }

    return (
        <ThingForm 
            meta={meta}
            // Si hay typeInfo, el formulario entra en modo edición
            thingToEdit={typeInfo}
            parentId={parentId}
            // Importante: flag para indicar que estamos trabajando con Types
            isType={true}
            funcFromZero={handleOperation}
        />
    )
}