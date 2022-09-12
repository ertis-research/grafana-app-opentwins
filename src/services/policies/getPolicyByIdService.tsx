import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { IStaticContext } from "utils/context/staticContext"

export const getPolicyByIdService = async ( context:IStaticContext, policyId : string ) => {
  return fetchDittoAPIService(context, "/policies/" + policyId, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}