import { fetchDittoService } from "services/general/fetchDittoService"

export const getPoliciesService = (policyId : string) => {
  return fetchDittoService("/policies/" + policyId, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}