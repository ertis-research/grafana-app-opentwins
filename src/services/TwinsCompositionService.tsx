import { Context } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"
import { fetchExtendedApiForDittoService } from "./FetchService"

// --- Header Helper Functions ---

/**
 * Creates standard 'Accept: application/json' headers
 * using credentials from the context.
 */
const getContextAuthAcceptHeaders = (context: Context) => ({
    "Authorization": 'Basic ' + btoa(context.ditto_username + ':' + context.ditto_password),
    "Accept": "application/json"
});

/**
 * Creates standard 'Content-Type: application/json' headers
 * using credentials from the context.
 */
const getContextAuthJsonHeaders = (context: Context) => ({
    "Authorization": 'Basic ' + btoa(context.ditto_username + ':' + context.ditto_password),
    "Content-Type": "application/json; charset=UTF-8"
});

// --- Children Services ---

/**
 * Creates or updates a twin as a child of a parent.
 */
export const createOrUpdateTwinToBeChildService = async (context: Context, parentId: string, childId: string, data?: IDittoThingData) => {
    
    const init: RequestInit = {
        method: 'PUT',
        headers: getContextAuthJsonHeaders(context)
    };

    // Only add a body if data is provided
    if (data) {
        init.body = JSON.stringify(data);
    }

    return await fetchExtendedApiForDittoService(context, `/twins/${parentId}/children/${childId}`, init)
}

/**
 * Deletes a twin and all its children.
 */
export const deleteTwinWithChildrenService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}/children`, {
        method: 'DELETE',
        headers: getContextAuthJsonHeaders(context) // Use JSON headers as per original
    })
}

/**
 * Gets all direct children of a twin.
 */
export const getChildrenOfTwinService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}/children`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

/**
 * Unlinks all children from a twin.
 */
export const unlinkAllChildrenTwinService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}/children/unlink`, {
        method: 'PATCH',
        headers: getContextAuthJsonHeaders(context) // Use JSON headers as per original
    })
}

// --- Parent Services ---

/**
 * Gets the parent of a twin.
 */
export const getParentOfTwinService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}/parent`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

/**
 * Unlinks a twin from its parent.
 */
export const unlinkParentTwinService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}/parent/unlink`, {
        method: 'PATCH',
        headers: getContextAuthAcceptHeaders(context) // Use Accept headers as per original
    })
}
