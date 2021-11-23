import { fetchDittoService } from "services/general/fetchDittoService"

export const deletePolicyService = async (policyId : string) => {
  return fetchDittoService("/policies/" + policyId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}