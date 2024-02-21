import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getConnectionByIdService = (context: Context, id: string) => {
  return fetchDittoAPIService(context, "/connections/" + id, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar'),
      "Accept": "application/json"
    }
  })
}
