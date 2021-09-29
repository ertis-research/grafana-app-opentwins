import { fetchDittoService } from "services/general/fetchDittoService"
import { POLICIES_THING_IN_DITTO } from "utils/consts"
import { IPolicy } from "utils/interfaces/dittoPolicy"

export const createPolicyService = (data:IPolicy) => {
    return fetchDittoService("/things/" + POLICIES_THING_IN_DITTO + "/attributes/list", {
      method: 'PATCH',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/merge-patch+json; charset=UTF-8"
      },
      body: JSON.stringify(data)
    })
}