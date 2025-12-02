import { useState, useEffect } from 'react';
import { MethodRequest } from 'utils/data/consts';
import { useHistory } from 'react-router-dom';
import { SimulationAttributes, SimulationContent } from 'utils/interfaces/simulation';
import { createOrUpdateSimulationService, getSimulationService } from 'services/SimulationsService';
import { enumNotification } from 'utils/auxFunctions/general';
import { ContentFieldFormData } from './SimulationForm.types';

export const useSimulationLogic = (twinId: string, resourceRoot: string, simulationId?: string) => {
    const history = useHistory();
    const iniMethod = MethodRequest.GET;
    const isEditMode = simulationId !== undefined;

    // Single source of truth for the simulation object
    const [simulation, setSimulation] = useState<SimulationAttributes>({
        id: "",
        url: "",
        method: iniMethod,
        content: undefined,
    });

    const [notificationState, setNotificationState] = useState(enumNotification.HIDE);

    // Load Initial Data
    useEffect(() => {
        if (simulationId) {
            setNotificationState(enumNotification.LOADING);
            getSimulationService(twinId, simulationId)
                .then((data: SimulationAttributes) => {
                    setSimulation(data);
                    setNotificationState(enumNotification.HIDE);
                })
                .catch(() => setNotificationState(enumNotification.ERROR));
        }
    }, [twinId, simulationId]);

    // Handlers for main attributes
    const updateAttribute = (key: keyof SimulationAttributes, value: any) => {
        setSimulation((prev) => ({ ...prev, [key]: value }));
    };

    const handleAddContent = (data: ContentFieldFormData) => {
        const newContentItem: SimulationContent = {
            name: data.name,
            type: data.typeSelect?.value!,
            required: data.required,
            default: data.default === "" ? undefined : data.default,
        };

        setSimulation((prev) => {
            const existingContent = prev.content || [];
            // Replace if exists, else add
            const exists = existingContent.some(c => c.name === newContentItem.name);
            const newContent = exists
                ? existingContent.map(c => c.name === newContentItem.name ? newContentItem : c)
                : [...existingContent, newContentItem];

            return { ...prev, content: newContent };
        });
    };

    const handleDeleteContent = (name: string) => {
        setSimulation((prev) => ({
            ...prev,
            content: prev.content?.filter(c => c.name !== name)
        }));
    };

    const handleClear = () => {
        setSimulation({ id: "", url: "", method: iniMethod, content: undefined });
    };

    const handleSubmit = async () => {
        setNotificationState(enumNotification.LOADING);
        try {
            await createOrUpdateSimulationService(twinId, simulation);
            setNotificationState(enumNotification.SUCCESS);
        } catch (error) {
            setNotificationState(enumNotification.ERROR);
        }
    };

    const goBackToList = () => {
        history.push(resourceRoot);
    };

    return {
        simulation,
        isEditMode,
        notificationState,
        setNotificationState,
        updateAttribute,
        handleAddContent,
        handleDeleteContent,
        handleSubmit,
        handleClear,
        goBackToList
    };
};
