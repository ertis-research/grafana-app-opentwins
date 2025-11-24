import { SimulationAttributes } from "utils/interfaces/simulation";
import { patchTwinService } from "./TwinsService";
import { fetchFromGrafanaProxy, PROXY_DITTO_URL, fetchService } from "./FetchService";
import { ContentType } from "utils/data/consts";
import { applyTypesOfFields } from "utils/auxFunctions/simulation";

// --- Service Functions ---

/**
 * Creates or updates a simulation entry in the twin's attributes.
 */
export const createOrUpdateSimulationService = async (twinId: string, simulation: SimulationAttributes) => {
    // This function relies on patchTwinService which should already be using the Proxy
    return await patchTwinService(twinId, {
        attributes: {
            _simulations: {
                [simulation.id]: simulation
            }
        }
    })
}

/**
 * Deletes a simulation entry from the twin's attributes.
 */
export const deleteSimulationService = async (twinId: string, id: string) => {
    return await patchTwinService(twinId, {
        attributes: {
            _simulations: {
                [id]: null // Ditto uses 'null' to remove a JSON property
            }
        }
    })
}

/**
 * Gets all simulations configured for a specific twin.
 */
export const getAllSimulationsService = async (twinId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_DITTO_URL}/things/${twinId}/attributes/_simulations`, {
        method: 'GET'
    });
}

/**
 * Gets a specific simulation configuration by ID.
 */
export const getSimulationService = async (twinId: string, id: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_DITTO_URL}/things/${twinId}/attributes/_simulations/${id}`, {
        method: 'GET'
    });
}

/**
 * Sends a request to the simulation endpoint (External URL).
 * Note: This connects to the URL defined in the simulation attributes, not Ditto directly.
 */
export const sendSimulationRequest = async (attributes: SimulationAttributes, data: { [key: string]: any }) => {
    let body: any = undefined;

    if (attributes.contentType && attributes.content) {
        switch (attributes.contentType) {
            case ContentType.JSON:
                data = applyTypesOfFields(data, attributes.content);
                body = JSON.stringify(data);
                break;

            case ContentType.FORM:
                body = new FormData();
                for (const [key, value] of Object.entries(data)) {
                    body.append(key, value as string | Blob);
                }
                break;
        }
    }

    // Uses the generic fetchService for external URLs
    return await fetchService(attributes.url, {
        method: attributes.method,
        body: body,
        mode: 'cors'
    });
}
