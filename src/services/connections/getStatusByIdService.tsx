import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getStatusByConnectionIdService = (context: Context, id: string) => {
  return fetchDittoAPIService(context, "/connections/" + id + "/status", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar'),
      "Accept": "application/json"
    }
  })
}
