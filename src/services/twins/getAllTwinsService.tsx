import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const getAllTwinsService = (context:IStaticContext) => {
  return fetchDittoExtendedService(context, "/twins", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}