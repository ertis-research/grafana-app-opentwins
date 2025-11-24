import { getBackendSrv } from "@grafana/runtime";
import { lastValueFrom } from "rxjs";

const PLUGIN_ID = 'ertis-opentwins-app';

// Rutas base para el Proxy
export const PROXY_AGENTS_URL = `api/plugin-proxy/${PLUGIN_ID}/agents`;
export const PROXY_EXTENDED_URL = `api/plugin-proxy/${PLUGIN_ID}/extended/api`;
export const PROXY_DITTO_URL = `api/plugin-proxy/${PLUGIN_ID}/ditto/api/2`;
export const PROXY_DEVOPS_URL = `api/plugin-proxy/${PLUGIN_ID}/dittodevops/api/2`;

// --- Helper Wrapper ---
export async function fetchFromGrafanaProxy(url: string, options: any) {
    const responseObservable = getBackendSrv().fetch<any>({
        url: url,
        showErrorAlert: false,
        ...options
    });
    //console.log(responseObservable)
    const result = await lastValueFrom(responseObservable);
    //console.log(result)
    return result.data; 
}

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
