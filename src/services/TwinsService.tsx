import { fetchFromGrafanaProxy, PROXY_DITTO_URL, PROXY_EXTENDED_URL } from "./FetchService";

// TODO: Asegúrate de que este ID coincide con el de tu plugin.json


// --- CRUD Services ---

/**
 * (CREATE/UPDATE) Creates a new twin or fully updates an existing one.
 */
export const createOrUpdateTwinService = async (twinId: string, twin: any) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}`, {
        method: 'PUT',
        data: twin 
    });
}

/**
 * (READ) Gets a single twin by its ID.
 */
export const getTwinService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}`, {
        method: 'GET'
    });
}

/**
 * (READ) Gets all root twins, handling pagination.
 */
export const getAllRootTwinsService = async () => {
    let allItems: any[] = [];
    let cursor: string | undefined = undefined;
    const baseUrl = `${PROXY_EXTENDED_URL}/twins?option=size(200)`;

    do {
        const url = cursor ? `${baseUrl},cursor(${cursor})` : baseUrl;
        
        const responseData = await fetchFromGrafanaProxy(url, {
            method: 'GET'
        });

        if (responseData?.items) {
            allItems = allItems.concat(responseData.items);
            cursor = responseData.cursor;
        }
        else if (Array.isArray(responseData)) {
            allItems = allItems.concat(responseData);
            cursor = undefined;
        }
        else {
            cursor = undefined;
        }

    } while (cursor);

    return allItems;
}

/**
 * (READ) Gets all twin IDs, handling pagination.
 */
export const getAllTwinsIdsService = async (): Promise<string[]> => {
    let allIds: string[] = [];
    let cursor: string | undefined = undefined;
    
    const baseUrl = `${PROXY_DITTO_URL}/search/things?filter=ne(attributes/_isType,true)&fields=thingId&option=size(200)`;

    do {
        const url = cursor ? `${baseUrl},cursor(${cursor})` : baseUrl;
        
        const responseData = await fetchFromGrafanaProxy(url, {
            method: 'GET'
        });

        const mapItemsToIds = (items: any[]): string[] => items.map((item: { thingId: string }) => item.thingId);

        if (responseData?.items) {
            allIds = allIds.concat(mapItemsToIds(responseData.items));
            cursor = responseData.cursor;
        }
        else if (Array.isArray(responseData)) {
            allIds = allIds.concat(mapItemsToIds(responseData));
            cursor = undefined; 
        }
        else {
            cursor = undefined; 
        }

    } while (cursor);

    return allIds;
}

/**
 * (UPDATE) Partially updates a twin's data.
 */
export const patchTwinService = async (twinId: string, patch: any) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}`, {
        method: 'PATCH',
        data: patch
    });
}

/**
 * (DELETE) Deletes a twin by its ID.
 */
export const deleteTwinService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}`, {
        method: 'DELETE'
    });
}

// --- Utility Services ---

/**
 * Duplicates an existing twin to a new ID, optionally applying a patch.
 */
export const duplicateTwinService = async (twinId: string, newId: string, patch?: any) => {
    const options: any = {
        method: 'POST'
    };

    if (patch) {
        options.data = patch;
    }

    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/twins/${twinId}/duplicate/${newId}`, options);
}
