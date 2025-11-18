import { Context } from "utils/context/staticContext"
import { fetchAgentsAPIService } from "./FetchService"

// --- Constantes para Headers ---

// Cabeceras para peticiones GET, DELETE, PUT, POST sin body JSON
const AGENT_ACCEPT_HEADERS = {
    "Accept": "application/json"
};

// Cabeceras para peticiones POST/PUT que envían JSON
const AGENT_JSON_HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json"
};

// --- CRUD de Agentes ---

export const createAgentService = async (context: Context, id: string, namespace: string, data: any) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}`, {
        method: 'POST',
        headers: AGENT_JSON_HEADERS,
        body: JSON.stringify(data)
    });
}

export const getAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}`, {
        method: 'GET',
        headers: AGENT_ACCEPT_HEADERS
    });
}

export const getAllAgentsService = async (context: Context, twinId?: string) => {
    // Usar URLSearchParams para construir la query string de forma segura
    const params = new URLSearchParams();
    
    if (context.agent_context && context.agent_context.trim() !== '') {
        params.append('context', context.agent_context);
    }
    if (twinId) {
        params.append('twin', twinId);
    }

    const queryString = params.toString();
    const url = queryString ? `/agents?${queryString}` : '/agents';

    return await fetchAgentsAPIService(context, url, {
        method: 'GET',
        headers: AGENT_ACCEPT_HEADERS
    });
}

export const deleteAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}`, {
        method: 'DELETE',
        headers: AGENT_ACCEPT_HEADERS
    });
}

// --- Comandos de Estado del Agente ---

export const pauseAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}/pause`, {
        method: 'POST',
        headers: AGENT_ACCEPT_HEADERS
    });
}

export const resumeAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}/resume`, {
        method: 'POST',
        headers: AGENT_ACCEPT_HEADERS
    });
}

// --- Enlace con Twins ---

export const linkTwinToAgentService = async (context: Context, id: string, twinId: string, namespace: string) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}/twin/${twinId}/link`, {
        method: 'PUT',
        headers: AGENT_ACCEPT_HEADERS
    });
}

export const unlinkTwinToAgentService = async (context: Context, id: string, twinId: string, namespace: string) => {
    return await fetchAgentsAPIService(context, `/agent/${namespace}/${id}/twin/${twinId}/unlink`, {
        method: 'PUT',
        headers: AGENT_ACCEPT_HEADERS
    });
}

// --- Logs ---

export const getLogByPodService = async (context: Context, podId: string) => {
    return await fetchAgentsAPIService(context, `/agents/${podId}/logs`, {
        method: 'GET',
        headers: AGENT_ACCEPT_HEADERS
    });
}
