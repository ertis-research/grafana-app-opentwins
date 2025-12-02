// src/components/ConnectionForm/ConnectionForm.tsx
import { AppEvents, SelectableValue, GrafanaTheme2 } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { css } from '@emotion/css'
import { Button, Form, FormAPI, RadioButtonGroup, Spinner, useStyles2 } from '@grafana/ui'
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import { checkIsEditor } from 'utils/auxFunctions/auth'
import { useConnectionForm } from './useConnectionForm'
import { defaultOtherConnection, initConnectionData, ProtocolOptions } from './utils/constants'
import { Protocols } from './ConnectionForm.types'
import { createConnectionWithIdService, createConnectionWithoutIdService, getConnectionByIdService } from 'services/ConnectionsService'
import { buildConnectionPayload } from './utils/payloadBuilder'
import { MqttOrKafkaForm } from './MqttOrKafkaForm'
import { OtherConnectionForm } from './OtherConnectionForm'
import logger from 'utils/logger'
import { transformApiDataToFormState } from './utils/transformApiToForm'

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
                .finally(() => setIsLoading(false))
        }
    }, [existingConnectionId]) // eslint-disable-line react-hooks/exhaustive-deps


    const handleOnSubmitFinal = () => {
        logger.info("[ConnectionForm] Submitting connection form...");
        setIsSaving(true);

        let submitPromise: Promise<any>;

        if (selectedProtocol.value === Protocols.OTHERS) {
            if (isEditMode) {
                const payload = { ...jsonOtherConnection, id: existingConnectionId };
                submitPromise = createConnectionWithoutIdService(payload);
            } else {
                submitPromise = createConnectionWithoutIdService(jsonOtherConnection);
            }
        } else {
            const payload = buildConnectionPayload(currentConnection, selectedProtocol.value!);
            submitPromise = createConnectionWithIdService(currentConnection.id, payload);
        }

        submitPromise
            .then(() => {
                logger.info(`[ConnectionForm] Connection ${isEditMode ? 'updated' : 'created'} successfully.`);
                appEvents.publish({ type: AppEvents.alertSuccess.name, payload: [`Connection ${isEditMode ? 'updated' : 'created'}`] });
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
        <div className={styles.centeredWrapper}>
            <div className={styles.formPanel}>

                {/* Header Section */}
                <div className={styles.header}>
                    <h2>
                        {isEditMode ? `Edit Connection: ${currentConnection.id}` : 'Create New Connection'}
                    </h2>
                    <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                        Back to list
                    </Button>
                </div>

                {/* Protocol Selector */}
                <div className={styles.radioGroupContainer}>
                    <RadioButtonGroup
                        options={ProtocolOptions}
                        value={selectedProtocol.value}
                        onChange={(v) => setSelectedProtocol({ label: v, value: v })}
                        disabled={isEditMode}
                    />
                </div>

                {/* Main Form Area */}
                <Form id="finalForm" onSubmit={handleOnSubmitFinal} className={styles.formContainer}>
                    {({ register, errors, control }: FormAPI<any>) => {
                        return (
                            <>
                                {renderFormByProtocol()}
                            </>
                        )
                    }}
                </Form>

                {/* Action Buttons Section (OUTSIDE Form, but visually connected) */}
                <div className={styles.buttonGroup}>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        form="finalForm" // Importante: vincula este botón al form de arriba
                        disabled={isSaving} 
                        icon={buttonIcon}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const getStyles = (theme: GrafanaTheme2) => ({
    centeredWrapper: css`
        display: flex;
        justify-content: center;
        width: 100%;
        padding-bottom: ${theme.spacing(4)};
    `,
    formPanel: css`
        background-color: ${theme.colors.background.primary};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.borderRadius()};
        padding: ${theme.spacing(4)};
        box-shadow: ${theme.shadows.z1};
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: ${theme.spacing(3)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        padding-bottom: ${theme.spacing(2)};
        
        h2 {
            margin: 0;
            font-size: ${theme.typography.h3.fontSize};
        }
    `,
    radioGroupContainer: css`
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: ${theme.spacing(3)};
    `,
    formContainer: css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 100%;
    `,
    buttonGroup: css`
        display: flex;
        justify-content: flex-end;
        gap: ${theme.spacing(2)};
        margin-top: ${theme.spacing(4)};
        padding-top: ${theme.spacing(2)};
        border-top: 1px solid ${theme.colors.border.weak};
    `
});
