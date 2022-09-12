import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { IStaticContext } from "utils/context/staticContext"

export const deletePolicyService = async (context:IStaticContext, policyId : string) => {
  return fetchDittoAPIService(context, "/policies/" + policyId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}