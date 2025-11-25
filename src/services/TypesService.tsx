import { IDittoThingData } from "utils/interfaces/dittoThing";
import { fetchFromGrafanaProxy, PROXY_EXTENDED_URL } from "./FetchService";

// --- CRUD Services ---

/**
 * (CREATE/UPDATE) Creates or updates a type definition.
 */
export const createOrUpdateTypeService = async (typeId: string, type: IDittoThingData) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}`, {
        method: 'PUT',
        data: type
    });
}

/**
 * (READ) Gets a single type by its ID.
 */
export const getTypeService = async (typeId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}`, {
        method: 'GET'
    });
}

/**
 * (READ) Gets all root types.
 */
export const getAllRootTypesService = async () => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types`, {
        method: 'GET'
    });
}

/**
 * (READ) Gets all types (including nested).
 */
export const getAllTypesService = async () => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/all`, {
        method: 'GET'
    });
}

/**
 * (UPDATE) Partially updates a type definition.
 */
export const patchTypeService = async (typeId: string, type: IDittoThingData) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}`, {
        method: 'PATCH',
        data: type
    });
}

/**
 * (DELETE) Deletes a type definition.
 */
export const deleteTypeService = async (typeId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}`, {
        method: 'DELETE'
    });
}

// --- Utility Services ---

/**
 * Creates a new twin instance based on a type.
 */
export const createTwinFromTypeService = async (twinId: string, typeId: string, data?: IDittoThingData) => {
    const options: any = {
        method: 'POST'
    };

    if (data) {
        options.data = data;
    }

    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}/create/${twinId}`, options);
}
