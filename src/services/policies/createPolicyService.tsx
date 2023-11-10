import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"
import { IPolicy } from "utils/interfaces/dittoPolicy"

export const createPolicyService = (context: Context, data: IPolicy) => {
  return fetchDittoAPIService(context, "/policies/"+ data.policyId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ entries : data.entries})
  })
}
