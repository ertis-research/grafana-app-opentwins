import { Context } from "utils/context/staticContext"
import { fetchDittoAPIService, fetchExtendedApiForDittoService } from "./FetchService"

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
 * (CREATE/UPDATE) Creates a new twin or fully updates an existing one.
 */
export const createOrUpdateTwinService = async (context: Context, twinId: string, twin: any /* IDittoThingData */) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}`, {
        method: 'PUT',
        headers: getContextAuthJsonHeaders(context),
        body: JSON.stringify(twin)
    });
}

/**
 * (READ) Gets a single twin by its ID.
 */
export const getTwinService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    });
}

/**
 * (READ) Gets all root twins, handling pagination.
 */
export const getAllRootTwinsService = async (context: Context) => {
    let allItems: any[] = [];
    let cursor: string | undefined = undefined;
    const baseUrl = "/twins?option=size(200)";

    do {
        const url = cursor ? `${baseUrl},cursor(${cursor})` : baseUrl;
        const response = await fetchExtendedApiForDittoService(context, url, {
            method: 'GET',
            headers: getContextAuthAcceptHeaders(context)
        });

        // Handle paginated response
        if (response?.items) {
            allItems = allItems.concat(response.items);
            cursor = response.cursor;
        } 
        // Handle non-paginated response (e.g., first or only page)
        else if (Array.isArray(response)) {
            allItems = allItems.concat(response);
            cursor = undefined; // Stop loop
        } 
        // Handle empty or unexpected response
        else {
            cursor = undefined; // Stop loop
        }

    } while (cursor);

    return allItems;
}

/**
 * (READ) Gets all twin IDs, handling pagination.
 */
export const getAllTwinsIdsService = async (context: Context): Promise<string[]> => {
    let allIds: string[] = [];
    let cursor: string | undefined = undefined;
    const baseUrl = "/search/things?filter=ne(attributes/_isType,true)&fields=thingId&option=size(200)";

    do {
        const url = cursor ? `${baseUrl},cursor(${cursor})` : baseUrl;
        const response = await fetchDittoAPIService(context, url, {
            method: 'GET',
            headers: getContextAuthAcceptHeaders(context)
        });

        const mapItemsToIds = (items: any[]): string[] => items.map((item: { thingId: string }) => item.thingId);

        // Handle paginated response
        if (response?.items) {
            allIds = allIds.concat(mapItemsToIds(response.items));
            cursor = response.cursor;
        } 
        // Handle non-paginated response
        else if (Array.isArray(response)) {
            allIds = allIds.concat(mapItemsToIds(response));
            cursor = undefined; // Stop loop
        }
        // Handle empty or unexpected response
        else {
            cursor = undefined; // Stop loop
        }

    } while (cursor);

    return allIds;
}

/**
 * (UPDATE) Partially updates a twin's data.
 */
export const patchTwinService = async (context: Context, twinId: string, patch: any) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}`, {
        method: 'PATCH',
        headers: getContextAuthJsonHeaders(context),
        body: JSON.stringify(patch)
    });
}

/**
 * (DELETE) Deletes a twin by its ID.
 */
export const deleteTwinService = async (context: Context, twinId: string) => {
    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}`, {
        method: 'DELETE',
        headers: getContextAuthAcceptHeaders(context) // Accept header is fine, Content-Type not needed
    });
}

// --- Utility Services ---

/**
 * Duplicates an existing twin to a new ID, optionally applying a patch.
 */
export const duplicateTwinService = async (context: Context, twinId: string, newId: string, patch?: any) => {
    const init: RequestInit = {
        method: 'POST',
        headers: getContextAuthJsonHeaders(context)
    };

    // Only add body if a patch is provided
    if (patch) {
        init.body = JSON.stringify(patch);
    }

    return await fetchExtendedApiForDittoService(context, `/twins/${twinId}/duplicate/${newId}`, init);
}
