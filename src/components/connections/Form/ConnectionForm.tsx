// src/components/ConnectionForm/ConnectionForm.tsx
import { AppEvents, AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Button, Form, FormAPI, RadioButtonGroup, Spinner } from '@grafana/ui'
import React, { Fragment, useEffect, useState } from 'react'
import { checkIsEditor } from 'utils/auxFunctions/auth'
import { useConnectionForm } from './hooks/useConnectionForm'
import { defaultOtherConnection, initConnectionData, ProtocolOptions } from './utils/constants'
import { Protocols } from './ConnectionForm.types'
import { createConnectionWithIdService, createConnectionWithoutIdService, getConnectionByIdService } from 'services/ConnectionsService'
import { buildConnectionPayload } from './utils/payloadBuilder'
import { MqttOrKafkaForm } from './MqttOrKafkaForm'
import { OtherConnectionForm } from './OtherConnectionForm'
import logger from 'utils/logger'
import { transformApiDataToFormState } from './utils/transformApiToForm'
import { useHistory } from 'react-router-dom'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    existingConnectionId?: string
}

// Renombrado de 'CreateFormConnection' a 'ConnectionForm'
export function ConnectionForm({ path, meta, existingConnectionId }: Parameters) {
    const appEvents = getAppEvents()

    const [isSaving, setIsSaving] = useState(false)
    const [selectedProtocol, setSelectedProtocol] = useState<SelectableValue<Protocols>>(ProtocolOptions[0])
    const [jsonOtherConnection, setJsonOtherConnection] = useState<any>(defaultOtherConnection)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(!!existingConnectionId)
    const history = useHistory()


    // 1. Usamos el hook personalizado para el estado del formulario
    const { currentConnection, setCurrentConnection, handlers } = useConnectionForm(initConnectionData)

    // 2. Efecto para comprobar autorización (sin cambios)
    useEffect(() => {
        checkIsEditor().then((res) => {
            if (!res) {
                logger.warn("[Auth] User lacks permissions. Redirecting.");
                window.location.replace(path)
            }
        })
    }, [path])

    // 3. ¡NUEVO! Efecto para cargar datos en modo EDICIÓN
    useEffect(() => {
        if (existingConnectionId) {
            logger.info(`[ConnectionForm] Edit mode enabled. Loading connection data for ID: ${existingConnectionId}`)

            setIsLoading(true)
            setIsEditMode(true)


            getConnectionByIdService(existingConnectionId)
                .then(apiData => {
                    const protocol = apiData.connectionType === 'kafka' ? Protocols.KAFKA : apiData.connectionType === 'mqtt-5' ? Protocols.MQTT5 : Protocols.OTHERS;
                    if (protocol === Protocols.OTHERS) {
                        setCurrentConnection({...initConnectionData, id: existingConnectionId});
                        setJsonOtherConnection({...apiData, id: undefined})
                    } else {
                        const formData = transformApiDataToFormState(apiData);
                        setCurrentConnection(formData);
                    }
                    setSelectedProtocol({ label: protocol, value: protocol });
                })
                .catch(e => {
                    appEvents.publish({ type: AppEvents.alertError.name, payload: ["Failed to load connection data: " + e.message] });
                })
                .finally(() => setIsLoading(false))


            // Simulación (elimina esto cuando implementes la llamada real)
            console.log("Modo Edición: Cargando datos para", existingConnectionId)
            setIsLoading(false) // Quita esto

        }
    }, [existingConnectionId])


    // 4. Lógica de Submit, ahora maneja "Crear" y "Actualizar"
    const handleOnSubmitFinal = () => {
        logger.info("[ConnectionForm] Submitting connection form...");
        logger.debug("[ConnectionForm] Protocol:", selectedProtocol.value);
        logger.debug("[ConnectionForm] Edit mode:", isEditMode);
        setIsSaving(true);

        if (selectedProtocol.value === Protocols.OTHERS) {
            logger.info("[ConnectionForm] Processing 'Other' connection type.");
            if (isEditMode) {
                setJsonOtherConnection({...jsonOtherConnection, id: existingConnectionId})
            }

            logger.debug("[ConnectionForm] Creating 'Other' connection with payload:", jsonOtherConnection);
            createConnectionWithoutIdService(jsonOtherConnection)
                .then(() => {
                    logger.info(`[ConnectionForm] 'Other' connection ${isEditMode ? 'updated' : 'created'} successfully.`);
                    appEvents.publish({ type: AppEvents.alertSuccess.name, payload: [`Connection ${isEditMode ? 'updated' : 'created'}`] });
                    history.push(`?tab=connections`);
                })
                .catch((e: Error) => {
                    logger.error("[ConnectionForm] Failed to create 'Other' connection:", e);
                    let msg = ""
                    try {
                        const response = JSON.parse(e.message)
                        msg = response.message + ". " + response.description
                    } catch (e) { }
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: [`Connection has not been ${isEditMode ? 'updated' : 'created'}. ` + msg]
                    });
                })
                .finally(() => {
                    setIsSaving(false); 
                });

        } else if (selectedProtocol.value) {
            logger.info("[ConnectionForm] Processing MQTT/Kafka connection submission.")
            const payload = buildConnectionPayload(currentConnection, selectedProtocol.value);
            logger.debug("[ConnectionForm] Payload generated:", payload);
            const serviceCall = () => createConnectionWithIdService(currentConnection.id, payload);

            serviceCall()
                .then(() => {
                    logger.info(`[ConnectionForm] Connection ${isEditMode ? "updated" : "created"} successfully.`);
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: [`Connection ${isEditMode ? 'updated' : 'created'} successfully`]
                    });
                    history.push(`?tab=connections`);
                })
                .catch((e: Error) => {
                    logger.error("[ConnectionForm] API request failed:", e);
                    let msg = ""
                    try {
                        const response = JSON.parse(e.message)
                        msg = response.message + ". " + response.description
                    } catch (e) { }
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: [`Connection has not been ${isEditMode ? 'updated' : 'created'}. ` + msg]
                    });
                })
                .finally(() => {
                    setIsSaving(false); 
                });
        }
    }

    // 5. Renderizado condicional de sub-formularios
    const renderFormByProtocol = () => {
        switch (selectedProtocol.value) {
            case Protocols.KAFKA:
            case Protocols.MQTT5:
                return <MqttOrKafkaForm
                    connectionData={currentConnection}
                    handlers={handlers}
                    protocol={selectedProtocol.value}
                    isEditMode={isEditMode}
                />
            default:
                return <OtherConnectionForm
                    jsonOtherConnection={jsonOtherConnection}
                    setJsonOtherConnection={setJsonOtherConnection}
                />
        }
    }

    if (isLoading) {
        return <Spinner size={30} />
    }

    const buttonText = isSaving 
        ? (isEditMode ? 'Updating...' : 'Creating...') 
        : (isEditMode ? 'Update Connection' : 'Create Connection');
        
    const buttonIcon = isSaving ? "spinner" : undefined;

    return (
        <Fragment>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {isEditMode ? `Edit Connection: ${currentConnection.id}` : 'New Connection'}
            </h2>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <RadioButtonGroup
                    options={ProtocolOptions}
                    value={selectedProtocol.value}
                    onChange={(v) => setSelectedProtocol({ label: v, value: v })}
                    disabled={isEditMode} // No puedes cambiar el protocolo al editar
                />
            </div>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                    {({ register, errors, control }: FormAPI<any>) => {
                        return renderFormByProtocol()
                    }}
                </Form>
                <Button style={{ marginTop: '10px' }} variant="primary" type="submit" form="finalForm" disabled={isSaving} icon={buttonIcon}>
                    {buttonText}
                </Button>
            </div>
        </Fragment>
    )
}
