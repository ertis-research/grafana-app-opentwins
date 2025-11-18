import { Context } from "utils/context/staticContext"

/**
 * Función principal para realizar peticiones fetch con manejo de errores.
 */
export const fetchService = async (url: string, init: RequestInit, allowNotFound = false) => {
    const res = await fetch(url, init)

    // Si la respuesta NO es OK y NO es un 404 permitido
    if (!res.ok && !(allowNotFound && res.status === 404)) {
        const txt = await res.text()
        throw new Error(txt || `Error: ${res.status}`) // Asegura un mensaje de error
    } else {
        try {
            // Si es un 404 permitido, devuelve undefined
            if (allowNotFound && res.status === 404) {
                return undefined
            }
            // Intenta parsear como JSON. Se clona para poder usar res.text() en el catch si falla
            return await res.clone().json()
        } catch (e) {
            // Si falla el .json() (ej. respuesta vacía), devuelve el texto
            return await res.text()
        }
    }
}

/**
 * Wrapper para el endpoint de Hono.
 */
export const fetchHonoService = async ( context: Context, url: string, init: RequestInit ) => {
    if(context.hono_endpoint) { // Más idiomático que !== ''
        return await fetchService(context.hono_endpoint + url, init)
    } else {
        throw new Error("Eclipse Hono endpoint not defined")
    }
}

/**
 * Wrapper para el endpoint extendido de Ditto (API).
 */
export const fetchExtendedApiForDittoService = async ( context: Context, url: string, init: RequestInit, allowNotFound = false ) => {
    if(context.ditto_extended_endpoint) {
        return await fetchService(context.ditto_extended_endpoint + "/api" + url, init, allowNotFound)
    } else {
        throw new Error("Extended API for Eclipse Ditto endpoint not defined")
    }
}

/**
 * Wrapper para el endpoint extendido de Ditto (DevOps).
 */
export const fetchExtendedApiForDittoDevopsService = async ( context: Context, url: string, init: RequestInit) => {
    if(context.ditto_extended_endpoint) {
        return await fetchService(context.ditto_extended_endpoint + url, init)
    } else {
        throw new Error("Extended API for Eclipse Ditto endpoint not defined")
    }
}

/**
 * Wrapper para el endpoint de la API v2 de Ditto.
 */
export const fetchDittoAPIService = async ( context: Context, url: string, init: RequestInit) => {
    if(context.ditto_endpoint) {
        return await fetchService(context.ditto_endpoint + "/api/2" + url, init)
    } else {
        throw new Error("Eclipse Ditto endpoint not defined")
    }
}

/**
 * Wrapper para el endpoint de la API de Agentes.
 */
export const fetchAgentsAPIService = async ( context: Context, url: string, init: RequestInit) => {
    if(context.agent_endpoint) {
        return await fetchService(context.agent_endpoint + url, init)
    } else {
        throw new Error("Agents API endpoint not defined")
    }
}
