import React, { useState, Fragment } from 'react';
import { AppEvents } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import {
    Button, Checkbox, Field, FieldSet, FileUpload, Form,
    Input, InputControl, Spinner, useStyles2
} from '@grafana/ui';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { deleteSimulationService, sendSimulationRequest } from 'services/SimulationsService';
import { duplicateTwinService } from 'services/TwinsService';
import { enumNotification, removeEmptyEntries } from 'utils/auxFunctions/general';
import { TypesOfField } from 'utils/data/consts';
import { SimulationContent } from 'utils/interfaces/simulation';
import { SimulationPanelProps } from '../SimulationsList.types';
import { getStyles } from '../SimulationsList.styles';

export const SimulationPanel = ({ simulation, twinId, onSuccess, isEditor }: SimulationPanelProps) => {
    const styles = useStyles2(getStyles);
    const appEvents = getAppEvents();
    const history = useHistory();
    const { url } = useRouteMatch();

    const [notificationState, setNotificationState] = useState<string>(enumNotification.HIDE);
    const [duplicateTwin, setDuplicateTwin] = useState<boolean>(false);

    // CAMPOS NUEVOS: Namespace y ID separados
    const [newNamespace, setNewNamespace] = useState<string>("");
    const [newId, setNewId] = useState<string>("");

    const [fileValues, setFileValues] = useState<{ [key: string]: File }>({});

    const handleNavigateToEdit = () => history.push(`${url}/${simulation.id}/edit`);

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete simulation "${simulation.id}"?`)) {
            try {
                await deleteSimulationService(twinId, simulation.id);
                onSuccess();
                appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ['Simulation deleted successfully'] });
            } catch (error) {
                appEvents.publish({ type: AppEvents.alertError.name, payload: ['Error deleting simulation'] });
            }
        }
    };

    const handleOnSubmit = async (formData: any) => {
        setNotificationState(enumNotification.LOADING);

        let data = { ...formData, ...fileValues };

        if (duplicateTwin) {
            // Validación de los dos campos
            if (!newNamespace || !newId) {
                appEvents.publish({
                    type: AppEvents.alertWarning.name,
                    payload: ["Namespace and ID are required to duplicate the twin"]
                });
                setNotificationState(enumNotification.HIDE);
                return;
            }

            // Concatenación Namespace:ID
            const fullNewTwinId = `${newNamespace}:${newId}`;
            const simulationOfAttribute = { attributes: { simulationOf: twinId } };

            try {
                await duplicateTwinService(twinId, fullNewTwinId, simulationOfAttribute);
                appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ["Twin duplicated successfully"] });

                // Limpieza y ejecución
                delete data.thingId;
                data = removeEmptyEntries(data);

                await sendSimulationRequest(simulation, data);
                appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ["Simulation request submitted"] });

            } catch (error) {
                console.error(error);
                appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error during duplication/simulation process"] });
            }

        } else {
            // Flujo simple
            delete data.thingId;
            data = removeEmptyEntries(data);

            try {
                await sendSimulationRequest(simulation, data);
                appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ["Simulation request submitted"] });
            } catch (error) {
                appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error calling simulation"] });
            }
        }

        setNotificationState(enumNotification.HIDE);
    };

    const renderDynamicFields = (control: any, register: any) => {
        if (!simulation.content) return null;

        return simulation.content.map((item: SimulationContent, idx) => {
            if (item.type === TypesOfField.FILE) {
                return (
                    <Field key={idx} label={item.name} description="Upload file" required={item.required}>
                        <InputControl control={control} name={item.name} render={({ field }: any) => (
                            <FileUpload {...field} onFileUpload={({ currentTarget }) => {
                                if (currentTarget.files && currentTarget.files[0]) {
                                    setFileValues(prev => ({ ...prev, [item.name]: currentTarget.files![0] }));
                                }
                            }} />
                        )} />
                    </Field>
                );
            }
            return (
                <Field key={idx} label={item.name} description={item.type} required={item.required}>
                    <Input
                        {...register(item.name, { required: item.required })}
                        type={item.type === TypesOfField.NUMBER ? "number" : "text"}
                        defaultValue={item.default}
                    />
                </Field>
            );
        });
    };

    return (
        <Fragment>
            <div className={styles.panelHeader}>
                <div>
                    <h3 style={{ margin: 0 }}>{simulation.id}</h3>
                    <div style={{ opacity: 0.7, fontSize: '12px' }}>{simulation.method} - {simulation.url}</div>
                </div>
                {isEditor && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" size="md" icon="pen" onClick={handleNavigateToEdit}>Edit</Button>
                        <Button aria-label='' variant="destructive" size="md" icon="trash-alt" onClick={handleDelete}>Delete</Button>
                    </div>
                )}
            </div>

            <Form onSubmit={handleOnSubmit} maxWidth="none">
                {({ register, control }) => (
                    <Fragment>
                        <div style={{ marginBottom: '24px' }}>
                            <Checkbox
                                value={duplicateTwin}
                                onChange={() => setDuplicateTwin(!duplicateTwin)}
                                label="Duplicate twin before executing"
                                description="Creates a copy with a new ID before simulating."
                            />

                            {duplicateTwin && (
                                <div className={styles.rowInputs}>
                                    <Field label="Namespace" required>
                                        <Input
                                            placeholder="e.g. org.eclipse.ditto"
                                            value={newNamespace}
                                            onChange={(e) => setNewNamespace(e.currentTarget.value)}
                                        />
                                    </Field>
                                    <Field label="ID" required>
                                        <Input
                                            placeholder="e.g. my-twin-v2"
                                            value={newId}
                                            onChange={(e) => setNewId(e.currentTarget.value)}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        {(simulation.content?.length || 0) > 0 && <h5>Parameters</h5>}
                        <FieldSet>
                            {renderDynamicFields(control, register)}
                        </FieldSet>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                            {notificationState === enumNotification.LOADING && <Spinner size={20} />}
                            <Button
                                type="submit"
                                icon="play"
                                variant="primary"
                                disabled={notificationState !== enumNotification.HIDE}
                            >
                                Simulate
                            </Button>
                        </div>
                    </Fragment>
                )}
            </Form>
        </Fragment>
    );
};
