// src/components/ConnectionForm/ConnectionForm.tsx
import { AppEvents, SelectableValue, GrafanaTheme2 } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { css } from '@emotion/css'
import { Button, Form, FormAPI, RadioButtonGroup, Spinner, useStyles2 } from '@grafana/ui'
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
// 1. Importamos useRouteMatch para saber dónde estamos
import { useHistory, useRouteMatch } from 'react-router-dom'

interface Parameters {
    path: string
    existingConnectionId?: string
}

export function ConnectionForm({ path, existingConnectionId }: Parameters) {
    const styles = useStyles2(getStyles);
    const appEvents = getAppEvents()
    const history = useHistory()
    const { url } = useRouteMatch();

    const [isSaving, setIsSaving] = useState(false)
    const [selectedProtocol, setSelectedProtocol] = useState<SelectableValue<Protocols>>(ProtocolOptions[0])
    const [jsonOtherConnection, setJsonOtherConnection] = useState<any>(defaultOtherConnection)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(!!existingConnectionId)

    const { currentConnection, setCurrentConnection, handlers } = useConnectionForm(initConnectionData)

    const goBackToList = () => {
        const listPath = url.split('/connections')[0] + '/connections';
        history.push(listPath);
    }

    useEffect(() => {
        checkIsEditor().then((res) => {
            if (!res) {
                logger.warn("[Auth] User lacks permissions. Redirecting.");
                history.replace('/');
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Carga de datos en Edición
    useEffect(() => {
        if (existingConnectionId) {
            logger.info(`[ConnectionForm] Edit mode enabled. Loading ID: ${existingConnectionId}`)

            setIsLoading(true)
            setIsEditMode(true)

            getConnectionByIdService(existingConnectionId)
                .then(apiData => {
                    const protocol = apiData.connectionType === 'kafka' ? Protocols.KAFKA : apiData.connectionType === 'mqtt-5' ? Protocols.MQTT5 : Protocols.OTHERS;
                    if (protocol === Protocols.OTHERS) {
                        setCurrentConnection({ ...initConnectionData, id: existingConnectionId });
                        setJsonOtherConnection({ ...apiData, id: undefined })
                    } else {
                        const formData = transformApiDataToFormState(apiData);
                        setCurrentConnection(formData);
                    }
                    setSelectedProtocol({ label: protocol, value: protocol });
                })
                .catch(e => {
                    appEvents.publish({ type: AppEvents.alertError.name, payload: ["Failed to load connection data: " + e.message] });
                })
                .finally(() => setIsLoading(false)) // <-- El lugar correcto para apagar el loading
        }
    }, [existingConnectionId]) // eslint-disable-line react-hooks/exhaustive-deps


    const handleOnSubmitFinal = () => {
        logger.info("[ConnectionForm] Submitting connection form...");
        setIsSaving(true);

        // Promesa genérica para manejar ambos casos
        let submitPromise: Promise<any>;

        if (selectedProtocol.value === Protocols.OTHERS) {
            if (isEditMode) {
                // Actualizamos el objeto local antes de enviarlo (por seguridad de closures)
                const payload = { ...jsonOtherConnection, id: existingConnectionId };
                // NOTA: Asumo que createConnectionWithoutIdService maneja updates si el ID va dentro, 
                // si tienes un updateService específico, úsalo aquí.
                submitPromise = createConnectionWithoutIdService(payload);
            } else {
                submitPromise = createConnectionWithoutIdService(jsonOtherConnection);
            }
        } else {
            const payload = buildConnectionPayload(currentConnection, selectedProtocol.value!);
            // Aquí igual: createConnectionWithIdService suele hacer PUT si existe, o POST si no.
            submitPromise = createConnectionWithIdService(currentConnection.id, payload);
        }

        submitPromise
            .then(() => {
                logger.info(`[ConnectionForm] Connection ${isEditMode ? 'updated' : 'created'} successfully.`);
                appEvents.publish({ type: AppEvents.alertSuccess.name, payload: [`Connection ${isEditMode ? 'updated' : 'created'}`] });

                // 3. NAVEGACIÓN RESTFUL: Volver al listado
                goBackToList();
            })
            .catch((e: Error) => {
                logger.error("[ConnectionForm] Request failed:", e);
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
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spinner size={30} /></div>
    }

    const buttonText = isSaving
        ? (isEditMode ? 'Updating...' : 'Creating...')
        : (isEditMode ? 'Update Connection' : 'Create Connection');

    const buttonIcon = isSaving ? "spinner" : undefined;

    return (
        <Fragment>
            {/* Botón sutil para cancelar/volver */}
            <div style={{ marginBottom: 20 }}>
                <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                    Back to list
                </Button>
            </div>
            <div className={styles.centeredWrapper}>
                <div className={styles.formPanel}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {isEditMode ? `Edit Connection: ${currentConnection.id}` : 'New Connection'}
                    </h2>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <RadioButtonGroup
                            options={ProtocolOptions}
                            value={selectedProtocol.value}
                            onChange={(v) => setSelectedProtocol({ label: v, value: v })}
                            disabled={isEditMode}
                        />
                    </div>

                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth={800} style={{ marginTop: '0px', paddingTop: '0px' }}>
                            {({ register, errors, control }: FormAPI<any>) => {
                                return renderFormByProtocol()
                            }}
                        </Form>
                        <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                            <Button variant="secondary" onClick={goBackToList} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" form="finalForm" disabled={isSaving} icon={buttonIcon}>
                                {buttonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const getStyles = (theme: GrafanaTheme2) => ({
    centeredWrapper: css`
        display: flex;
        justify-content: center; // Centra la tarjeta horizontalmente
        width: 100%;
        padding-bottom: ${theme.spacing(4)}; // Un poco de aire abajo
    `,

    formPanel: css`
        background-color: ${theme.colors.background.primary};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.borderRadius()};
        padding: ${theme.spacing(4)};
        box-shadow: ${theme.shadows.z1};
        
        // Centrado y ancho máximo para que no se estire demasiado en pantallas grandes
        width: 100%;           // Intenta ocupar todo el ancho...
        max-width: 900px;      // ...pero detente en 900px.
        
        // Esto asegura que el contenido interno también se alinee bien
        display: flex;
        flex-direction: column;
        align-items: center;
    `,
});
