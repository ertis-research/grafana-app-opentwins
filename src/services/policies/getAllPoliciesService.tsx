import { fetchDittoService } from "services/general/fetchDittoService"
import { POLICIES_THING_IN_DITTO } from "utils/consts"

export const getAllPoliciesService = () => {
  return fetchDittoService("/things/" + POLICIES_THING_IN_DITTO + "/attributes/list", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}