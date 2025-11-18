import { IDittoThingData } from "utils/interfaces/dittoThing"
import { Context } from "utils/context/staticContext"
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

// --- CRUD Services ---

/**
 * (CREATE/UPDATE) Creates or updates a type definition.
 */
export const createOrUpdateTypeService = async (context: Context, typeId: string, type: IDittoThingData) => {
    return await fetchExtendedApiForDittoService(context, `/types/${typeId}`, {
        method: 'PUT',
        headers: getContextAuthJsonHeaders(context),
        body: JSON.stringify(type)
    })
}

/**
 * (READ) Gets a single type by its ID.
 */
export const getTypeService = async (context: Context, typeId: string) => {
    return await fetchExtendedApiForDittoService(context, `/types/${typeId}`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

/**
 * (READ) Gets all root types.
 */
export const getAllRootTypesService = async (context: Context) => {
    return await fetchExtendedApiForDittoService(context, "/types", {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

/**
 * (READ) Gets all types (including nested).
 */
export const getAllTypesService = async (context: Context) => {
    return await fetchExtendedApiForDittoService(context, "/types/all", {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

/**
 * (UPDATE) Partially updates a type definition.
 */
export const patchTypeService = async (context: Context, typeId: string, type: IDittoThingData) => {
    return await fetchExtendedApiForDittoService(context, `/types/${typeId}`, {
        method: 'PATCH',
        headers: getContextAuthJsonHeaders(context), // Fixed: Use Content-Type for body
        body: JSON.stringify(type)
    })
}

/**
 * (DELETE) Deletes a type definition.
 */
export const deleteTypeService = async (context: Context, typeId: string, type: IDittoThingData) => {
    return await fetchExtendedApiForDittoService(context, `/types/${typeId}`, {
        method: 'DELETE',
        headers: getContextAuthJsonHeaders(context), // Fixed: Use Content-Type for body
        body: JSON.stringify(type)
    })
}

// --- Utility Services ---

/**
 * Creates a new twin instance based on a type.
 */
export const createTwinFromTypeService = async (context: Context, twinId: string, typeId: string, data?: IDittoThingData) => {
    
    const init: RequestInit = {
        method: 'POST',
        headers: getContextAuthJsonHeaders(context) // Fixed: Use Content-Type for body
    };

    if (data) {
        init.body = JSON.stringify(data);
    }

    return await fetchExtendedApiForDittoService(context, `/types/${typeId}/create/${twinId}`, init)
}
