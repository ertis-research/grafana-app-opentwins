import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const getAllPoliciesService = (context:IStaticContext) => {
  return fetchDittoExtendedService(context, "/policies", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}