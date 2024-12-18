import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const deleteConnectionByIdService = (context: Context, id: string) => {
  return fetchDittoAPIService(context, "/connections/" + id, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar'),
      "Accept": "application/json"
    }
  })
}
