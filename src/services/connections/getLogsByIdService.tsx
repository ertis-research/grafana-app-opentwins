import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getLogsByConnectionIdService = (context: Context, id: string) => {
  return fetchDittoAPIService(context, "/connections/" + id + "/logs", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar'),
      "Accept": "application/json"
    }
  })
}

export const enableConnectionLogsService = (context: Context, id: string) => {
  return fetchDittoAPIService(context, "/connections/" + id + "/command", {
    method: 'POST',
    headers: {
      "Authorization": 'Basic '+btoa('devops:foobar'),
      "Content-Type": "text/plain"
    },
    body: 'connectivity.commands:enableConnectionLogs'
  })
}
