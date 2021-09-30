import { fetchDittoService } from "services/general/fetchDittoService"
import { POLICIES_THING_IN_DITTO } from "utils/consts"
import { IPolicy } from "utils/interfaces/dittoPolicy"
import { getAllPoliciesService } from "./getAllPoliciesService"

export const createPolicyService = (data:IPolicy) => {
  console.log(JSON.stringify({ entries : data.entries}))
  return fetchDittoService("/policies/"+ data.policyId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({ entries : data.entries})
  }).then((res:any) => {
    return getAllPoliciesService().then(res => {
      res.push(data.policyId)
      return fetchDittoService("/things/" + POLICIES_THING_IN_DITTO + "/attributes/list", {
        method: 'PATCH',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Content-Type": "application/merge-patch+json; charset=UTF-8"
        },
        body: JSON.stringify(res)
      })
    }).catch(() => console.log("error"))
  }).catch(() => console.log("error"))
}