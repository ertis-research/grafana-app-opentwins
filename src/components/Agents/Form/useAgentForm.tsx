import { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { AppEvents, SelectableValue } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import yaml from 'js-yaml';

// Contexts & Services
import { StaticContext } from 'utils/context/staticContext';
import { checkIsEditor } from 'utils/auxFunctions/auth';
import { setNestedKey } from 'utils/auxFunctions/general';
import logger from 'utils/logger';
import { getAllTwinsIdsService } from 'services/TwinsService';
import { createAgentService } from 'services/AgentsService';
import { AgentFormat, AgentFormData, FormatOptions } from './AgentForm.types';

// Types

export const useAgentForm = (propId?: string) => {
    const context = useContext(StaticContext);
    const appEvents = getAppEvents();
    const history = useHistory();
    const { url } = useRouteMatch();

    // State
    const [agent, setAgent] = useState<AgentFormData>({
        id: '',
        namespace: '',
        data: '',
        twins: [],
        name: ''
    });
    const [selectedFormat, setSelectedFormat] = useState<SelectableValue<AgentFormat>>(FormatOptions[0]);
    const [selectedTwins, setSelectedTwins] = useState<Array<SelectableValue<string>>>([]);
    const [availableTwins, setAvailableTwins] = useState<Array<SelectableValue<string>>>([]);

    const hasSetContext: boolean = context.agent_context !== undefined && context.agent_context.trim() !== '';

    // -- Effects --

    // 1. Auth & Load Twins
    useEffect(() => {
        checkIsEditor().then((isEditor) => {
            if (!isEditor) {
                logger.warn("[Auth] User lacks permissions. Redirecting.");
                history.replace('/');
            }
        });

        getAllTwinsIdsService()
            .then((res: string[]) => {
                setAvailableTwins(res.map((id) => ({ value: id, label: id })));
            })
            .catch(() => {
                appEvents.publish({
                    type: AppEvents.alertError.name,
                    payload: ["Error getting the identifiers of digital twins"],
                });
            });
    }, []);

    // 2. Sync Namespace from Context
    useEffect(() => {
        setAgent((prev: any) => ({ ...prev, namespace: context.agent_context || '' }));
    }, [context]);

    // 3. Handle prop ID (Sync initial twin selection if ID matches)
    useEffect(() => {
        if (propId && !selectedTwins.some((s) => s.value === propId)) {
            setSelectedTwins((prev) => [...prev, { label: propId, value: propId }]);
        }
    }, [propId]);

    // -- Handlers --

    const handleInputChange = (
        e: FormEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
        field: keyof AgentFormData
    ) => {
        const value = e.currentTarget.value;
        setAgent((prev) => ({ ...prev, [field]: value }));
    };

    const goBackToList = () => {
        const listPath = url.split('/agents')[0] + '/agents';
        history.push(listPath);
    };

    const validateString = (val: string): string | null => {
        if (val.includes(" ")) { return "Blank spaces are not allowed" };
        if (val.toLowerCase() !== val) { return "Uppercase letters are not allowed" };
        if (val.includes("_")) { return "Underscores are not allowed" };
        return null; // Valid
    };

    const handleSubmit = async () => {
        let jsonData: any = {};

        // 1. Parse Data
        try {
            if (selectedFormat.value === AgentFormat.YAML) {
                jsonData = yaml.load(agent.data);
            } else {
                jsonData = JSON.parse(agent.data);
            }
        } catch (e) {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`Invalid format. Please check your ${selectedFormat.value} syntax.`],
            });
            return;
        }

        // 2. Validate Kind
        if (jsonData['kind'] !== 'Deployment' && jsonData['kind'] !== 'CronJob') {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Only Kubernetes 'Deployment' and 'CronJob' are accepted."],
            });
            return;
        }

        // 3. Enrich Data
        try {
            jsonData = setNestedKey(jsonData, ['metadata', 'labels', 'opentwins.agents/name'], agent.name);
            const twinIds = selectedTwins.map((v) => v.value).filter((v): v is string => !!v);
            jsonData = setNestedKey(jsonData, ['metadata', 'labels', 'opentwins.agents/twins'], twinIds);

            // 4. API Call
            await createAgentService(agent.id, agent.namespace, jsonData);
            
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: ["Agent successfully created"],
            });
            // Opcional: Redirigir tras éxito
            // goBackToList(); 

        } catch (error) {
            console.error(error);
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error creating the agent. Check the definition and network."],
            });
        }
    };

    return {
        agent,
        availableTwins,
        selectedTwins,
        setSelectedTwins,
        selectedFormat,
        setSelectedFormat,
        hasSetContext,
        validateString,
        handleInputChange,
        handleSubmit,
        goBackToList
    };
};
