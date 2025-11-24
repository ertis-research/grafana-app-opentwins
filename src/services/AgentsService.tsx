import { Context } from "utils/context/staticContext";
import { fetchFromGrafanaProxy, PROXY_AGENTS_URL } from "./FetchService";

// --- Agent CRUD ---

/**
 * Creates a new agent in a specific namespace.
 */
export const createAgentService = async (id: string, namespace: string, data: any) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}`, {
        method: 'POST',
        data: data
    });
}

/**
 * Gets a specific agent by ID and namespace.
 */
export const getAgentByIdService = async (id: string, namespace: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}`, {
        method: 'GET'
    });
}

/**
 * Gets all agents, optionally filtered by twin ID or context.
 */
export const getAllAgentsService = async (context: Context, twinId?: string) => {
    // Use URLSearchParams to safely build the query string
    const params = new URLSearchParams();
    
    if (context.agent_context && context.agent_context.trim() !== '') {
        params.append('context', context.agent_context);
    }
    if (twinId) {
        params.append('twin', twinId);
    }

    const queryString = params.toString();
    const url = queryString 
        ? `${PROXY_AGENTS_URL}/agents?${queryString}` 
        : `${PROXY_AGENTS_URL}/agents`;

    return await fetchFromGrafanaProxy(url, {
        method: 'GET'
    });
}

/**
 * Deletes an agent by ID and namespace.
 */
export const deleteAgentByIdService = async (id: string, namespace: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}`, {
        method: 'DELETE'
    });
}

// --- Agent State Commands ---

/**
 * Pauses a specific agent.
 */
export const pauseAgentByIdService = async (id: string, namespace: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}/pause`, {
        method: 'POST'
    });
}

/**
 * Resumes a specific agent.
 */
export const resumeAgentByIdService = async (id: string, namespace: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}/resume`, {
        method: 'POST'
    });
}

// --- Twin Linking ---

/**
 * Links a twin to a specific agent.
 */
export const linkTwinToAgentService = async (id: string, twinId: string, namespace: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}/twin/${twinId}/link`, {
        method: 'PUT'
    });
}

/**
 * Unlinks a twin from a specific agent.
 */
export const unlinkTwinToAgentService = async (id: string, twinId: string, namespace: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agent/${namespace}/${id}/twin/${twinId}/unlink`, {
        method: 'PUT'
    });
}

// --- Logs ---

/**
 * Gets logs for a specific agent pod.
 */
export const getLogByPodService = async (podId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_AGENTS_URL}/agents/${podId}/logs`, {
        method: 'GET'
    });
}
