import { IDittoThingData } from "utils/interfaces/dittoThing";
import { fetchFromGrafanaProxy, PROXY_EXTENDED_URL } from "./FetchService";

// --- Children Services ---

/**
 * Creates or updates a twin as a child of a parent.
 */
export const createOrUpdateTwinToBeChildService = async (parentId: string, childId: string, data?: IDittoThingData) => {
    
    const options: any = {
        method: 'PUT'
    };

    // Only add data if provided
    if (data) {
        options.data = data;
    }

    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${parentId}/children/${childId}`, options);
}

/**
 * Deletes a twin and all its children.
 */
export const deleteTwinWithChildrenService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}/children`, {
        method: 'DELETE'
    });
}

/**
 * Gets all direct children of a twin.
 */
export const getChildrenOfTwinService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}/children`, {
        method: 'GET'
    });
}

/**
 * Unlinks all children from a twin.
 */
export const unlinkAllChildrenTwinService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}/children/unlink`, {
        method: 'PATCH'
    });
}

// --- Parent Services ---

/**
 * Gets the parent of a twin.
 */
export const getParentOfTwinService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}/parent`, {
        method: 'GET'
    });
}

/**
 * Unlinks a twin from its parent.
 */
export const unlinkParentTwinService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}/parent/unlink`, {
        method: 'PATCH'
    });
}
