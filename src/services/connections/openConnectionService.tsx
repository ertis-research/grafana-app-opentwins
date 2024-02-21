import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const openConnectionService = (context: Context, id: string) => {
  return fetchDittoAPIService(context, "/connections/" + id + "/command", {
    method: 'POST',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar')
    },
    body: 'connectivity.commands:openConnection'
  })
}
