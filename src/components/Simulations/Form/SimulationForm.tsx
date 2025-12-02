import React, { useState } from 'react';
import {
    Button,
    ConfirmModal,
    Field,
    Input,
    Modal,
    Select,
    Switch,
    TextArea,
    useStyles2,
    Icon,
    FieldSet
} from '@grafana/ui';
import { SelectData } from 'utils/interfaces/select';
import { enumToISelectList, enumNotification } from 'utils/auxFunctions/general';
import { MethodRequest, ContentType } from 'utils/data/consts';

import { SimulationFormProps } from './SimulationForm.types';
import { getStyles } from './SimulationForm.styles';
import { useSimulationLogic } from './useSimulationLogic';
import { ContentList } from './subcomponents/ContentList';
import { ContentFieldForm } from './subcomponents/ContentFieldForm';
import { useRouteMatch } from 'react-router-dom';

export const SimulationForm = ({ path, meta, id: twinId, simulationId }: SimulationFormProps) => {
    const styles = useStyles2(getStyles);

    const { url } = useRouteMatch();
    const resourceRoot = url.split(`/simulations`)[0] + `/simulations`;

    const logic = useSimulationLogic(twinId, resourceRoot, simulationId);
    const { simulation, isEditMode, notificationState, updateAttribute, goBackToList } = logic;

    const [showPreview, setShowPreview] = useState(false);

    const methodList: SelectData[] = enumToISelectList(MethodRequest);
    const contentTypeList: SelectData[] = enumToISelectList(ContentType);

    const isLoading = notificationState === enumNotification.LOADING;
    // Convertir explícitamente a booleano para evitar undefined
    const hasContent = !!simulation.content || (simulation.content !== undefined && simulation.content !== null);

    const renderNotification = () => {
        if (notificationState === enumNotification.SUCCESS) {
            if (isEditMode) {
                return (
                    <Modal isOpen title="Successful edition!" icon="check" onDismiss={() => logic.setNotificationState(enumNotification.HIDE)}>
                        You can re-edit the simulation or leave the page.
                    </Modal>
                );
            }
            return (
                <ConfirmModal
                    isOpen
                    title="Successful creation!"
                    body="What would you like to do next?"
                    confirmText="Clear fields (New)"
                    dismissText="Keep fields"
                    icon="check"
                    onConfirm={() => { logic.handleClear(); logic.setNotificationState(enumNotification.HIDE); }}
                    onDismiss={() => logic.setNotificationState(enumNotification.HIDE)}
                />
            );
        }
        if (notificationState === enumNotification.ERROR) {
            return (
                <Modal isOpen title="Error" icon="exclamation-triangle" onDismiss={() => logic.setNotificationState(enumNotification.HIDE)}>
                    The simulation could not be saved. Please check the data.
                </Modal>
            );
        }
        return null;
    };

    const headerTitle = isEditMode ? `Edit Simulation: ${simulationId}` : "Create New Simulation";
    const buttonText = isEditMode ? "Save Changes" : "Create Simulation";

    return (
        <div className={styles.centeredWrapper}>
            {renderNotification()}

            <div className={styles.formPanel}>

                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2>{headerTitle}</h2>
                        <div style={{ opacity: 0.7, fontSize: '0.9em' }}>For Twin ID: {twinId}</div>
                    </div>
                    <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                        Back to list
                    </Button>
                </div>

                {/* Form Body */}
                <div className={styles.formContainer}>

                    <FieldSet label="General Details">
                        {/* ID y Description Verticales (sin flexRow) */}
                        <Field label="ID" required={!isEditMode} description="Unique identifier for this simulation.">
                            <Input
                                value={simulation.id}
                                onChange={(e) => updateAttribute('id', e.currentTarget.value)}
                                required
                                disabled={isEditMode || isLoading}
                                placeholder="sim-001"
                            />
                        </Field>

                        <Field label="Description" description="Short description of what this simulation does.">
                            <Input
                                value={simulation.description || ''}
                                onChange={(e) => updateAttribute('description', e.currentTarget.value)}
                                disabled={isLoading}
                                placeholder="e.g. Simulate temperature rise"
                            />
                        </Field>
                    </FieldSet>

                    <FieldSet label="Request Configuration" className={styles.fieldSet}>
                        <div className={styles.methodUrlGrid}>
                            <Field label="Method" required>
                                <Select
                                    options={methodList}
                                    value={simulation.method}
                                    onChange={(v) => updateAttribute('method', v.value)}
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field label="URL" required>
                                <Input
                                    type="url"
                                    value={simulation.url}
                                    onChange={(e) => updateAttribute('url', e.currentTarget.value)}
                                    disabled={isLoading}
                                    placeholder="http://..."
                                    prefix={<Icon name="globe" />}
                                />
                            </Field>
                        </div>
                    </FieldSet>
                    <div>
                        {/* Dynamic Content Section */}

                        <Field label="Enable Body Content?" description="Configure fields to be sent in the body of the request.">
                            <Switch
                                value={hasContent}
                                onChange={(e) => {
                                    // Lógica segura para el switch
                                    const checked = e.currentTarget.checked;
                                    updateAttribute('content', checked ? [] : undefined);
                                }}
                                disabled={isLoading}
                            />
                        </Field>
                        {hasContent && (
                            <div className={styles.subSection}>
                                <Field label="Content-Type" required>
                                    <Select
                                        options={contentTypeList}
                                        value={simulation.contentType}
                                        onChange={(v) => updateAttribute('contentType', v.value)}
                                        disabled={isLoading}
                                    />
                                </Field>

                                <hr style={{ opacity: 0.1, margin: '16px 0' }} />

                                {/* Aquí estaba el error. El subcomponente ahora es seguro. */}
                                <ContentFieldForm
                                    onAdd={logic.handleAddContent}
                                    disabled={isLoading}
                                />

                                <div style={{ marginTop: '16px' }}>
                                    <ContentList
                                        items={simulation.content || []}
                                        onDelete={logic.handleDeleteContent}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="mt-4">
                        <Button variant="secondary" size="sm" fill="text" icon={showPreview ? "angle-up" : "angle-down"} onClick={() => setShowPreview(!showPreview)}>
                            {showPreview ? "Hide JSON Preview" : "Show JSON Preview"}
                        </Button>
                        {showPreview && (
                            <TextArea
                                className={styles.textArea}
                                value={JSON.stringify(simulation, null, 4)}
                                readOnly
                            />
                        )}
                    </div>

                </div>

                <div className={styles.buttonGroup}>
                    <Button
                        variant="primary"
                        onClick={logic.handleSubmit}
                        disabled={isLoading}
                        icon={isLoading ? "spinner" : undefined}
                    >
                        {buttonText}
                    </Button>
                </div>

            </div>
        </div>
    );
};
