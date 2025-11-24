import { Policy } from "utils/interfaces/dittoPolicy";
import { fetchFromGrafanaProxy, PROXY_DITTO_URL, PROXY_EXTENDED_URL } from "./FetchService";

// --- Services ---

/**
 * Creates or updates a policy using context authentication.
 */
export const createOrUpdatePolicyService = async (data: Policy) => {
    return await fetchFromGrafanaProxy(`${PROXY_DITTO_URL}/policies/${data.policyId}`, {
        method: 'PUT',
        data: { entries: data.entries }
    });
}

/**
 * Deletes a policy.
 */
export const deletePolicyService = async (policyId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_DITTO_URL}/policies/${policyId}`, {
        method: 'DELETE'
    });
}

/**
 * Gets a policy by ID.
 */
export const getPolicyByIdService = async (policyId: string) => {
    return await fetchFromGrafanaProxy(`${PROXY_DITTO_URL}/policies/${policyId}`, {
        method: 'GET'
    });
}

/**
 * Gets all policies from the extended endpoint.
 */
export const getAllPoliciesService = async () => {
    // Note: This function targets the extended endpoint
    return await fetchFromGrafanaProxy(`${PROXY_EXTENDED_URL}/policies`, {
        method: 'GET'
    });
}
