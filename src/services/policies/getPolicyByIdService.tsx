import { fetchDittoService } from "services/general/fetchDittoService"
import { IStaticContext } from "utils/context/staticContext"

export const getPolicyByIdService = async ( context:IStaticContext, policyId : string ) => {
  return fetchDittoService(context, "/policies/" + policyId, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}