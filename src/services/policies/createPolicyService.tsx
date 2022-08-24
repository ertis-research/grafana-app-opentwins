import { fetchDittoService } from "services/general/fetchDittoService"
import { IStaticContext } from "utils/context/staticContext"
import { IPolicy } from "utils/interfaces/dittoPolicy"

export const createPolicyService = (context:IStaticContext, data:IPolicy) => {
  return fetchDittoService(context, "/policies/"+ data.policyId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ entries : data.entries})
  })
}