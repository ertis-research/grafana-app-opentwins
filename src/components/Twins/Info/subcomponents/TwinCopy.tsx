import React, { useEffect, useState } from 'react';
import { AppEvents, GrafanaTheme2 } from '@grafana/data';
import { Button, Field, Form, Input, useStyles2, Spinner } from '@grafana/ui';
import { getAppEvents } from '@grafana/runtime';
import { css } from '@emotion/css';
import { duplicateTwinService } from 'services/TwinsService';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { checkIsEditor } from 'utils/auxFunctions/auth';
import logger from 'utils/logger';

// --- Interfaces ---
interface TwinCopyProps {
    id: string;
}

interface DuplicateForm {
    id: string;
    namespace: string;
}

// --- Custom Hook (Lógica) ---
// Puedes mover esto a un archivo separado 'useTwinCopy.ts' si prefieres
const useTwinCopy = (sourceId: string) => {
    const appEvents = getAppEvents();
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const { url } = useRouteMatch();

    const handleDuplicateTwin = async (data: DuplicateForm) => {
        setIsLoading(true);

        try {
            // La lógica original concatenaba namespace + id
            await duplicateTwinService(sourceId, `${data.namespace}:${data.id}`);

            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: ["The twin has been duplicated successfully. You can access it from the main twins tab."]
            });
        } catch (error) {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["The twin could not be duplicated. Check the fields entered and the API connection."]
            });
        } finally {
            setIsLoading(false);
        }
    };

    const goBackToList = () => {
        const listPath = url.split('/twins')[0] + '/twins/' + sourceId;
        history.push(listPath);
    };

    return {
        isLoading,
        handleDuplicateTwin,
        goBackToList
    };
};

// --- Componente Principal ---
export function TwinCopy({ id }: TwinCopyProps) {
    const styles = useStyles2(getStyles);
    const { isLoading, handleDuplicateTwin, goBackToList } = useTwinCopy(id);

    const descriptionDuplicate = "Enter the id and namespace you want the duplicate twin to have. Note that all its children will also be copied.";

    useEffect(() => {
        checkIsEditor().then((res) => {
            if (!res) {
                logger.warn("[Auth] User lacks permissions. Redirecting.");
                goBackToList()
            }
        })
    }, [])

    return (
        <div className={styles.centeredWrapper}>
            <div className={styles.formPanel}>

                {/* Header Section */}
                <div className={styles.header}>
                    <div>
                        <h2>Duplicate Twin</h2>
                        <p className={styles.subHeader}>{descriptionDuplicate}</p>
                    </div>
                    <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                        Back
                    </Button>
                </div>

                {/* Form Section */}
                <Form onSubmit={handleDuplicateTwin} className={styles.formContainer} maxWidth="none">
                    {({ register, errors }) => (
                        <>
                            <Field
                                label="Namespace"
                                required
                                disabled={isLoading}
                                invalid={!!errors.namespace}
                                error={errors.namespace?.message}
                            >
                                <Input
                                    {...register("namespace", { required: "Namespace is required" })}
                                    placeholder="e.g. production"
                                    disabled={isLoading}
                                />
                            </Field>

                            <Field
                                label="Id"
                                required
                                disabled={isLoading}
                                invalid={!!errors.id}
                                error={errors.id?.message}
                            >
                                <Input
                                    {...register("id", { required: "ID is required" })}
                                    placeholder="e.g. my-new-twin-01"
                                    disabled={isLoading}
                                />
                            </Field>

                            <div className={styles.buttonGroup}>
                                {isLoading && <Spinner size={20} style={{ marginRight: '10px' }} />}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Duplicating...' : 'Duplicate'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

// --- Estilos (Consistentes con AgentForm) ---
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
        max-width: 600px; /* Un poco más estrecho que AgentForm ya que tiene menos campos */
        display: flex;
        flex-direction: column;
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: ${theme.spacing(3)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        padding-bottom: ${theme.spacing(2)};
        
        h2 {
            margin: 0;
            font-size: ${theme.typography.h3.fontSize};
        }
    `,
    subHeader: css`
        color: ${theme.colors.text.secondary};
        margin-top: ${theme.spacing(1)};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    formContainer: css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `,
    buttonGroup: css`
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: ${theme.spacing(2)};
        margin-top: ${theme.spacing(4)};
        padding-top: ${theme.spacing(2)};
        border-top: 1px solid ${theme.colors.border.weak};
    `
});
