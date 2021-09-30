import { fetchDittoService } from "services/general/fetchDittoService"

export const getPolicyByIdService = async (policyId : string) => {
  return fetchDittoService("/policies/" + policyId, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}