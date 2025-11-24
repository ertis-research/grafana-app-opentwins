import { IDittoThing, IDittoThingData } from "utils/interfaces/dittoThing";
import { fetchFromGrafanaProxy, PROXY_EXTENDED_URL } from "./FetchService";

// --- Type Children Services ---

/**
 * Creates or updates a child relationship for a specific type.
 */
export const createOrUpdateTypeToBeChildService = async (parentId: string, childId: string, num: number, data?: IDittoThingData) => {
    
    const options: any = {
        method: 'PUT'
    };

    if (data) {
        options.data = data;
    }

    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${parentId}/children/${childId}/${num}`, options);
}

/**
 * Unlinks (removes) all children from a specific type.
 */
export const unlinkChildrenType = async (parentId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${parentId}/children/unlink`, {
        method: 'PATCH'
    });
}

/**
 * Unlinks a specific child from a specific type by ID.
 */
export const unlinkChildrenTypeById = async (parentId: string, childId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${parentId}/children/${childId}/unlink`, {
        method: 'PATCH'
    });
}

/**
 * Gets all children associated with a specific type.
 */
export const getChildrenOfTypeService = async (typeId: string): Promise<IDittoThing[]> => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}/children`, {
        method: 'GET'
    });
}

// --- Type Parent Services ---

/**
 * Gets the parent definition of a specific type.
 */
export const getParentOfTypeService = async (typeId: string): Promise<{ [id: string]: number } | undefined> => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${typeId}/parent`, {
        method: 'GET'
    });
}

/**
 * Unlinks (removes) the parent relationship from a specific type.
 */
export const unlinkAllParentType = async (parentId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/types/${parentId}/parent/unlink`, {
        method: 'PATCH'
    });
}
