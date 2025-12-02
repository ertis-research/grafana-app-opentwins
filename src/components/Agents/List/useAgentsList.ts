import { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AppEvents } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';

import { StaticContext } from 'utils/context/staticContext';
import { ListAgent, AgentState, Types_values } from 'utils/interfaces/agents';
import { SelectData } from 'utils/interfaces/select';
import { getCurrentUserRole, Roles } from 'utils/auxFunctions/auth';
import { enumNotification } from 'utils/auxFunctions/general';
import {
    getAllAgentsService, getAgentByIdService, deleteAgentByIdService,
    pauseAgentByIdService, resumeAgentByIdService, getLogByPodService,
     linkTwinToAgentService, unlinkTwinToAgentService
} from 'services/AgentsService';

import { AgentInfo, LogEntry, FilterState } from './AgentsList.types';
import { getAllTwinsIdsService } from 'services/TwinsService';

export const useAgentsList = (twinId?: string) => {
    const context = useContext(StaticContext);
    const appEvents = getAppEvents();
    const history = useHistory();
    const location = useLocation();

    // State
    const [agents, setAgents] = useState<ListAgent[]>([]);
    const [filteredAgents, setFilteredAgents] = useState<ListAgent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<AgentInfo | undefined>(undefined);
    const [loadingState, setLoadingState] = useState<string>(enumNotification.READY);

    // Filters
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        type: Types_values[0]
    });

    // Aux Data
    const [twins, setTwins] = useState<SelectData[]>([]);
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER);
    const [latestLogs, setLatestLogs] = useState<LogEntry[]>([]);
    const [isLogLoading, setIsLogLoading] = useState<boolean>(false);

    const pluginBase = location.pathname.split('/agents')[0].split('/twins')[0];

    // --- Helpers ---
    const handleNavigateToCreate = () => {
        const path = twinId ? `${pluginBase}/twins/${twinId}/agents/new` : `${pluginBase}/agents/new`;
        history.push(path);
    };

    const handleNavigateToTwin = (twinIdTarget: string) => {
        history.push(`${pluginBase}/twins/${twinIdTarget}`);
    };

    // --- Data Fetching ---
    const fetchAgents = () => {
        if (agents.length < 1) setLoadingState(enumNotification.LOADING);

        getAllAgentsService(context, twinId).then((res: ListAgent[]) => {
            const sorted = res.sort((a, b) => (a.namespace + a.id).localeCompare(b.namespace + b.id));
            setAgents(sorted);
            setLoadingState(enumNotification.READY);

            // Refresh selected agent if exists
            if (selectedAgent) {
                const updated = res.find(a => a.id === selectedAgent.id);
                if (updated) setSelectedAgent(prev => prev ? ({ ...prev, info: updated }) : undefined);
            }
        }).catch((e) => {
            console.error(e);
            appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error getting agents"] });
        });
    };

    const fetchAgentDetails = (agent: ListAgent) => {
        getAgentByIdService(agent.id, agent.namespace).then((res: any) => {
            if (res) setSelectedAgent({ id: agent.id, info: agent, data: JSON.parse(res) });
        }).catch((e) => {
            appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error getting agent details"] });
        });
    };

    const fetchLog = (podId: string, idx: number) => {
        setIsLogLoading(true);
        getLogByPodService(podId).then((res: string) => {
            const newLogs = [...latestLogs];
            newLogs[idx] = { timestamp: Date.now(), text: res };
            setLatestLogs(newLogs);
        }).finally(() => setIsLogLoading(false));
    };

    // --- Actions ---
    const handlePausePlay = (agent: ListAgent) => {
        const action = agent.status === AgentState.ACTIVE ? pauseAgentByIdService : resumeAgentByIdService;
        action(agent.id, agent.namespace).then(fetchAgents).catch(() => {
            appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error changing agent state"] });
        });
    };

    const handleDelete = (agent: ListAgent) => {
        return deleteAgentByIdService(agent.id, agent.namespace).then(() => {
            fetchAgents();
            setSelectedAgent(undefined);
            appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ["Agent deleted"] });
        });
    };

    const handleLinkTwins = (agentId: string, namespace: string, twinIds: string[]) => {
        const promises = twinIds.map(id => linkTwinToAgentService(agentId, id, namespace));
        Promise.all(promises).then(() => {
            appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ["Twins linked"] });
            fetchAgents();
        }).catch((e) => {
            // Parse error message if possible
            appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error linking twins"] });
        });
    };

    const handleUnlinkTwin = (agentId: string, namespace: string, twinId: string) => {
        unlinkTwinToAgentService(agentId, twinId, namespace).then(() => {
            appEvents.publish({ type: AppEvents.alertSuccess.name, payload: ["Twin unlinked"] });
            fetchAgents();
        });
    };

    // --- Effects ---
    useEffect(() => {
        fetchAgents();
        getAllTwinsIdsService().then((res: any) => setTwins(res.map((id : any) => ({ value: id, label: id }))));
        getCurrentUserRole().then(role => setUserRole(role));

        const interval = setInterval(fetchAgents, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let filtered = [...agents];
        if (filters.search) {
            const lower = filters.search.toLowerCase();
            filtered = filtered.filter(a =>
                a.id.toLowerCase().includes(lower) ||
                a.name.toLowerCase().includes(lower) ||
                a.namespace.toLowerCase().includes(lower)
            );
        }
        if (filters.type.value && filters.type.value !== 'all') {
            filtered = filtered.filter(a => a.type === filters.type.value);
        }
        setFilteredAgents(filtered);
    }, [agents, filters]);

    useEffect(() => {
        if (selectedAgent) {
            setLatestLogs(Array(selectedAgent.info.pods.length).fill(undefined));
        }
    }, [selectedAgent?.id]); // Reset logs only when agent ID changes

    return {
        // State
        agents: filteredAgents,
        selectedAgent,
        loadingState,
        filters,
        twins,
        userRole,
        latestLogs,
        isLogLoading,
        hasAgents: agents.length > 0,

        // Setters / Handlers
        setFilters,
        setSelectedAgent: (agent: ListAgent | undefined) => {
            if (!agent) setSelectedAgent(undefined);
            else if (selectedAgent?.id !== agent.id) fetchAgentDetails(agent);
            else setSelectedAgent(undefined); // Toggle off
        },
        handleNavigateToCreate,
        handleNavigateToTwin,
        handlePausePlay,
        handleDelete,
        handleLinkTwins,
        handleUnlinkTwin,
        fetchLog
    };
};