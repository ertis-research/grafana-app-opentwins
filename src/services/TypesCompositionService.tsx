
import { Context } from "utils/context/staticContext"
import { IDittoThing, IDittoThingData } from "utils/interfaces/dittoThing"
import { fetchExtendedApiForDittoService } from "./FetchService";

// --- Funciones Helper para Cabeceras ---

/**
 * Crea cabeceras estándar 'Accept: application/json'
 * usando las credenciales del contexto.
 */
const getContextAuthAcceptHeaders = (context: Context) => ({
    "Authorization": 'Basic ' + btoa(context.ditto_username + ':' + context.ditto_password),
    "Accept": "application/json"
});

/**
 * Crea cabeceras estándar 'Content-Type: application/json'
 * usando las credenciales del contexto.
 */
const getContextAuthJsonHeaders = (context: Context) => ({
    "Authorization": 'Basic ' + btoa(context.ditto_username + ':' + context.ditto_password),
    "Content-Type": "application/json; charset=UTF-8"
});

// --- Servicios de "Type Children" ---

export const createOrUpdateTypeToBeChildService = async (context: Context, parentId: string, childId: string, num: number, data?: IDittoThingData) => {
    
    const init: RequestInit = {
        method: 'PUT',
        headers: getContextAuthJsonHeaders(context)
    };

    if (data) {
        init.body = JSON.stringify(data);
    }

    return await fetchExtendedApiForDittoService(context, `/types/${parentId}/children/${childId}/${num}`, init)
}

export const unlinkChildrenType = async (context: Context, parentId: string) => {
    return await fetchExtendedApiForDittoService(context, `/types/${parentId}/children/unlink`, {
        method: 'PATCH',
        headers: getContextAuthAcceptHeaders(context)
    })
}

export const unlinkChildrenTypeById = async (context: Context, parentId: string, childId: string) => {
    return await fetchExtendedApiForDittoService(context, `/types/${parentId}/children/${childId}/unlink`, {
        method: 'PATCH',
        headers: getContextAuthAcceptHeaders(context)
    })
}

export const getChildrenOfTypeService = async (context: Context, typeId: string): Promise<IDittoThing[]> => {
    return await fetchExtendedApiForDittoService(context, `/types/${typeId}/children`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    }, true)
}

// --- Servicios de "Type Parent" ---

export const getParentOfTypeService = async (context: Context, typeId: string): Promise<{ [id: string]: number } | undefined> => {
    return await fetchExtendedApiForDittoService(context, `/types/${typeId}/parent`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    }, true)
}

export const unlinkAllParentType = async (context: Context, parentId: string) => {
    return await fetchExtendedApiForDittoService(context, `/types/${parentId}/parent/unlink`, {
        method: 'PATCH',
        headers: getContextAuthAcceptHeaders(context)
    })
}
