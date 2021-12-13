import { fetchDittoService } from "services/general/fetchDittoService"
import { IStaticContext } from "utils/context/staticContext"

export const deletePolicyService = async (context:IStaticContext, policyId : string) => {
  return fetchDittoService(context, "/policies/" + policyId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}