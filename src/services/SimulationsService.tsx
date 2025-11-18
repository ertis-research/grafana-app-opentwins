import { Context } from "utils/context/staticContext"
import { SimulationAttributes } from "utils/interfaces/simulation"
import { patchTwinService } from "./TwinsService"
import { fetchDittoAPIService, fetchService } from "./FetchService"
import { ContentType } from "utils/data/consts"
import { applyTypesOfFields } from "utils/auxFunctions/simulation"

// --- Header Helper Functions ---

/**
 * Creates standard 'Accept: application/json' headers
 * using credentials from the context.
 */
const getContextAuthAcceptHeaders = (context: Context) => ({
    "Authorization": 'Basic ' + btoa(context.ditto_username + ':' + context.ditto_password),
    "Accept": "application/json"
});

// --- Service Functions ---

export const createOrUpdateSimulationService = async (context: Context, twinId: string, simulation: SimulationAttributes) => {
    // This function now correctly awaits the async patch service
    return await patchTwinService(context, twinId, {
        attributes: {
            _simulations: {
                [simulation.id]: simulation
            }
        }
    })
}

export const deleteSimulationService = async (context: Context, twinId: string, id: string) => {
    // This function now correctly awaits the async patch service
    return await patchTwinService(context, twinId, {
        attributes: {
            _simulations: {
                [id]: null // Ditto uses 'null' to remove a JSON property
            }
        }
    })
}

export const getAllSimulationsService = async (context: Context, twinId: string) => {
    return await fetchDittoAPIService(context, `/things/${twinId}/attributes/_simulations`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

export const getSimulationService = async (context: Context, twinId: string, id: string) => {
    return await fetchDittoAPIService(context, `/things/${twinId}/attributes/_simulations/${id}`, {
        method: 'GET',
        headers: getContextAuthAcceptHeaders(context)
    })
}

export const sendSimulationRequest = async (attributes: SimulationAttributes, data: { [key: string]: any }) => {
    let body: any = undefined

    if (attributes.contentType && attributes.content) {
        switch (attributes.contentType) {
            case ContentType.JSON:
                data = applyTypesOfFields(data, attributes.content)
                body = JSON.stringify(data)
                break;

            case ContentType.FORM:
                body = new FormData();
                // Use a cleaner loop to build FormData
                for (const [key, value] of Object.entries(data)) {
                    body.append(key, value as string | Blob);
                }
                break;
        }
    }

    // Added missing 'await'
    return await fetchService(attributes.url, {
        method: attributes.method,
        body: body,
        mode: 'cors'
    })
}
