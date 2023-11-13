import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"
import { Policy } from "utils/interfaces/dittoPolicy"

export const createOrUpdatePolicyService = (context: Context, data: Policy) => {
  console.log(data)
  return fetchDittoAPIService(context, "/policies/"+ data.policyId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa(context.ditto_username + ':' + context.ditto_password),
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ entries : data.entries})
  })
}
