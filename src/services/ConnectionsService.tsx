import { Context } from "utils/context/staticContext"
import { fetchDittoAPIService } from "./FetchService"

// --- Constantes para Headers ---

// Token de autorización
const DITTO_AUTH_HEADER = 'Basic ' + btoa('devops:foobar');

// Cabeceras para peticiones GET/DELETE (solo aceptan JSON)
const AUTH_ACCEPT_HEADERS = {
    "Authorization": DITTO_AUTH_HEADER,
    "Accept": "application/json"
};

// Cabeceras para peticiones POST/PUT que envían JSON
const AUTH_JSON_HEADERS = {
    "Authorization": DITTO_AUTH_HEADER,
    "Content-Type": "application/json",
    "Accept": "application/json"
};

// Cabeceras para peticiones POST que envían texto plano (comandos)
const AUTH_TEXT_HEADERS = {
    "Authorization": DITTO_AUTH_HEADER,
    "Content-Type": "text/plain"
};

// --- Servicios ---

export const closeConnectionService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: AUTH_TEXT_HEADERS,
        body: 'connectivity.commands:closeConnection'
    })
}

export const createConnectionWithIdService = async (context: Context, id: string, data: any) => {
    return await fetchDittoAPIService(context, `/connections/${id}`, {
        method: 'PUT',
        headers: AUTH_JSON_HEADERS,
        body: JSON.stringify(data)
    })
}

export const createConnectionWithoutIdService = async (context: Context, data: any) => {
    return await fetchDittoAPIService(context, "/connections", {
        method: 'POST',
        headers: AUTH_JSON_HEADERS,
        body: JSON.stringify(data)
    })
}

export const deleteConnectionByIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}`, {
        method: 'DELETE',
        headers: AUTH_ACCEPT_HEADERS
    })
}

export const getAllConnectionIdsService = async (context: Context) => {
    return await fetchDittoAPIService(context, "/connections", {
        method: 'GET',
        headers: AUTH_ACCEPT_HEADERS
    })
}

export const getConnectionByIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}`, {
        method: 'GET',
        headers: AUTH_ACCEPT_HEADERS
    })
}

export const getLogsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/logs`, {
        method: 'GET',
        headers: AUTH_ACCEPT_HEADERS
    })
}

export const enableConnectionLogsService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: AUTH_TEXT_HEADERS,
        body: 'connectivity.commands:enableConnectionLogs'
    })
}

export const getMetricsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/metrics`, {
        method: 'GET',
        headers: AUTH_ACCEPT_HEADERS
    })
}

export const getStatusByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/status`, {
        method: 'GET',
        headers: AUTH_ACCEPT_HEADERS
    })
}

export const openConnectionService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: AUTH_TEXT_HEADERS,
        body: 'connectivity.commands:openConnection'
    })
}

export const refreshLogsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: AUTH_TEXT_HEADERS,
        body: 'connectivity.commands:resetConnectionLogs'
    })
}

export const refreshMetricsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: AUTH_TEXT_HEADERS,
        body: 'connectivity.commands:resetConnectionMetrics'
    })
}
