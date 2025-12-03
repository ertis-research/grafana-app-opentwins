import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Spinner } from '@grafana/ui'
import { ThingForm } from 'components/Things/Form/ThingForm'
import React, { useEffect, useState, useCallback } from 'react'
import { createOrUpdateTwinToBeChildService } from 'services/TwinsCompositionService'
import { createOrUpdateTwinService, getTwinService } from 'services/TwinsService'
import { createTwinFromTypeService } from 'services/TypesService'
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing'

interface TwinFormProps {
    /** Meta datos del plugin */
    meta: AppPluginMeta<KeyValue<any>>
    /** ID del Twin si se está EDITANDO. Si es undefined, se asume modo CREACIÓN. */
    twinId?: string
    /** ID del Padre si se está creando como HIJO. Solo aplica en modo CREACIÓN. */
    parentId?: string
}

export const TwinForm = ({ meta, twinId, parentId }: TwinFormProps) => {
    const [twinInfo, setTwinInfo] = useState<IDittoThing | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(!!twinId)

    // Cargar datos si estamos en modo Edición
    useEffect(() => {
        if (twinId) {
            setIsLoading(true)
            getTwinService(twinId)
                .then((info: IDittoThing) => {
                    setTwinInfo(info)
                })
                .catch((err) => {
                    console.error("Error fetching twin data", err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [twinId])

    // Handler para crear/editar desde cero (sin tipo base)
    const handleZeroOperation = useCallback((id: string, data?: IDittoThingData) => {
        // Caso 1: Edición de un twin existente
        if (twinId) {
            // Nota: En edición, 'id' suele ser el mismo que 'twinId', pero usamos el argumento por si cambia
            return createOrUpdateTwinService(id, data!)
        }
        // Caso 2: Creación como hijo de otro twin
        if (parentId) {
            return createOrUpdateTwinToBeChildService(parentId, id, data)
        }
        // Caso 3: Creación standalone (sin padre)
        return createOrUpdateTwinService(id, data!)
    }, [twinId, parentId])

    // Handler para crear desde un Tipo (Type)
    const handleTypeOperation = useCallback((thingId: string, typeId: string, data?: IDittoThingData) => {
        // Paso 1: Crear desde el tipo
        const creationPromise = createTwinFromTypeService(thingId, typeId, data)

        // Paso 2: Si hay un padre, vincularlo después de crear
        if (!twinId && parentId) {
            return creationPromise.then(() =>
                createOrUpdateTwinToBeChildService(parentId, thingId)
            )
        }

        return creationPromise
    }, [parentId, twinId])

    if (isLoading) {
        return <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
            <Spinner size={20} />
        </div>
    }

    return (
        <ThingForm
            meta={meta}
            // Si hay twinInfo, el formulario entra en modo edición automáticamente
            thingToEdit={twinInfo}
            // Pasamos parentId para contexto visual o lógico dentro del form si es necesario
            parentId={parentId}
            isType={false}
            funcFromZero={handleZeroOperation}
            funcFromType={handleTypeOperation}
        />
    )
}