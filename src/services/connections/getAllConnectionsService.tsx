import { fetchDittoDevopsService } from "services/general/fetchDittoDevopsService"
import { IStaticContext } from "utils/context/staticContext"

export const getAllConnectionIdsService = (context:IStaticContext) => {
  return fetchDittoDevopsService(context, "", {
    method: 'POST',
    headers: {
      "Authorization": 'Basic '+btoa(context.ditto_username_devops + ":" + context.ditto_password_devops),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "targetActorSelection": "/user/connectivityRoot/connectionIdsRetrieval/singleton",
      "headers": {
        "aggregate": false
      },
      "piggybackCommand": {
        "type": "connectivity.commands:retrieveAllConnectionIds"
      }
    })
  })
}