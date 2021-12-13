import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { ITwin } from "utils/interfaces/dittoThing"

export const createTwinService = ( context:IStaticContext, twin:ITwin ) => {
  return fetchDittoExtendedService(context, "/twins/" + twin.twinId, {
    method: 'POST',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    },
    body: JSON.stringify(twin)
  }).catch(() => console.log("error"))
}
