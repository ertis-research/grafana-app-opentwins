import { IDittoThingData } from "utils/interfaces/dittoThing";
import { fetchFromGrafanaProxy, PROXY_DITTO_URL, PROXY_EXTENDED_URL } from "./FetchService";

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

export const getTypesPaginatedService = async (
    cursor?: string,
    pageSize = 50,
    searchQuery = ''
) => {

    let optionParam = `size(${pageSize})`;
    if (cursor) {
        optionParam += `,cursor(${cursor})`;
    }

    const typeFilter = 'eq(attributes/_isType,true)';
    const andConditions = [typeFilter];

    if (searchQuery) {
        const q = searchQuery.replace(/"/g, '\\"');
        const lower = q.toLowerCase();
        const upper = q.toUpperCase();
        const cap = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
        const filterSearch = `or(like(thingId,"*${q}*"),like(attributes/name,"*${q}*"),like(attributes/name,"*${lower}*"),like(attributes/name,"*${upper}*"),like(attributes/name,"*${cap}*"))`;

        andConditions.push(filterSearch);
    }

    const filterParam = `and(${andConditions.join(',')})`;
    const url = `${PROXY_DITTO_URL}/search/things?option=${optionParam}&filter=${filterParam}`;

    const responseData = await fetchFromGrafanaProxy(url, {
        method: 'GET'
    });

    if (responseData?.items) {
        return {
            items: responseData.items,
            cursor: responseData.cursor
        };
    } else if (Array.isArray(responseData)) {
        return { items: responseData, cursor: undefined };
    }

    return { items: [], cursor: undefined };
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
