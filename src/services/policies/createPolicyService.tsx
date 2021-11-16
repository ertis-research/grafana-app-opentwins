import { fetchDittoService } from "services/general/fetchDittoService"
import { IPolicy } from "utils/interfaces/dittoPolicy"

export const createPolicyService = (data:IPolicy) => {
  console.log(JSON.stringify({ entries : data.entries}))
  return fetchDittoService("/policies/"+ data.policyId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ entries : data.entries})
  }).catch(() => console.log("error"))
}