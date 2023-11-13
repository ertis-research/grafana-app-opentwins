import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getPolicyByIdService = async ( context: Context, policyId: string ) => {
  return fetchDittoAPIService(context, "/policies/" + policyId, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+ btoa(context.ditto_username + ':' + context.ditto_password),//+btoa(context.ditto_username + ':' + context.ditto_password),
      "Accept": "application/json"
    }
  })
}
