import { Context } from "utils/context/staticContext"
import { fetchDittoAPIService } from "./FetchService"

// --- Constantes para Headers ---

const getAuthAcceptHeaders = (context: Context) => ({
    "Accept": "application/json",
    "Authorization": 'Basic ' + btoa(context.ditto_username_devops + ':' + context.ditto_password_devops)
});

const getAuthJsonHeaders = (context: Context) => ({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": 'Basic ' + btoa(context.ditto_username_devops + ':' + context.ditto_password_devops)
});

const getAuthTextHeaders = (context: Context) => ({
    "Content-Type": "text/plain",
    "Authorization": 'Basic ' + btoa(context.ditto_username_devops + ':' + context.ditto_password_devops)
});

// --- Servicios ---

export const closeConnectionService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: getAuthTextHeaders(context),
        body: 'connectivity.commands:closeConnection'
    })
}

export const createConnectionWithIdService = async (context: Context, id: string, data: any) => {
    return await fetchDittoAPIService(context, `/connections/${id}`, {
        method: 'PUT',
        headers: getAuthJsonHeaders(context),
        body: JSON.stringify(data)
    })
}

export const createConnectionWithoutIdService = async (context: Context, data: any) => {
    return await fetchDittoAPIService(context, "/connections", {
        method: 'POST',
        headers: getAuthJsonHeaders(context),
        body: JSON.stringify(data)
    })
}

export const deleteConnectionByIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}`, {
        method: 'DELETE',
        headers: getAuthAcceptHeaders(context)
    })
}

export const getAllConnectionIdsService = async (context: Context) => {
    return await fetchDittoAPIService(context, "/connections", {
        method: 'GET',
        headers: getAuthAcceptHeaders(context)
    })
}

export const getConnectionByIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}`, {
        method: 'GET',
        headers: getAuthAcceptHeaders(context)
    })
}

export const getLogsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/logs`, {
        method: 'GET',
        headers: getAuthAcceptHeaders(context)
    })
}

export const enableConnectionLogsService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: getAuthTextHeaders(context),
        body: 'connectivity.commands:enableConnectionLogs'
    })
}

export const getMetricsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/metrics`, {
        method: 'GET',
        headers: getAuthAcceptHeaders(context)
    })
}

export const getStatusByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/status`, {
        method: 'GET',
        headers: getAuthAcceptHeaders(context)
    })
}

export const openConnectionService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: getAuthTextHeaders(context),
        body: 'connectivity.commands:openConnection'
    })
}

export const refreshLogsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: getAuthTextHeaders(context),
        body: 'connectivity.commands:resetConnectionLogs'
    })
}

export const refreshMetricsByConnectionIdService = async (context: Context, id: string) => {
    return await fetchDittoAPIService(context, `/connections/${id}/command`, {
        method: 'POST',
        headers: getAuthTextHeaders(context),
        body: 'connectivity.commands:resetConnectionMetrics'
    })
}
