import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const getAllPoliciesService = (context:IStaticContext) => {
  return fetchExtendedApiForDittoService(context, "/policies", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}