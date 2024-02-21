import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getAllConnectionIdsService = (context: Context) => {
  return fetchDittoAPIService(context, "/connections", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar'),
      "Accept": "application/json"
    }
  })
}
