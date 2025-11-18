import { Context } from "utils/context/staticContext"
import { Policy } from "utils/interfaces/dittoPolicy"
import { fetchDittoAPIService, fetchExtendedApiForDittoService } from "./FetchService"

// --- Helpers de Cabeceras ---

/**
 * Devuelve cabeceras de autenticación dinámicas (del contexto) para PUT/POST.
 */
const getContextAuthJsonHeaders = (context: Context) => ({
    "Authorization": 'Basic ' + btoa(context.ditto_username + ':' + context.ditto_password),
    "Content-Type": "application/json; charset=UTF-8"
});

// --- Servicios ---

/**
 * Crea o actualiza una política. Usa la autenticación del contexto.
 */
export const createOrUpdatePolicyService = async (context: Context, data: Policy) => {
    return await fetchDittoAPIService(context, "/policies/" + data.policyId, {
        method: 'PUT',
        headers: getContextAuthJsonHeaders(context),
        body: JSON.stringify({ entries: data.entries })
    });
}

/**
 * Borra una política..
 */
export const deletePolicyService = async (context: Context, policyId: string) => {
    return await fetchDittoAPIService(context, "/policies/" + policyId, {
        method: 'DELETE',
        headers: getContextAuthJsonHeaders(context)
    });
}

/**
 * Obtiene una política por ID..
 */
export const getPolicyByIdService = async (context: Context, policyId: string) => {
    return await fetchDittoAPIService(context, "/policies/" + policyId, {
        method: 'GET',
        headers: getContextAuthJsonHeaders(context)
    });
}

/**
 * Obtiene todas las políticas desde el endpoint extendido.
 */
export const getAllPoliciesService = async (context: Context) => {
    // Nota: Esta función usa 'fetchExtendedApiForDittoService'
    return await fetchExtendedApiForDittoService(context, "/policies", {
        method: 'GET',
        headers: getContextAuthJsonHeaders(context)
    });
}
