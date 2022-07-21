import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const createOrUpdateTwinService = ( context:IStaticContext, twinId:string, twin:IDittoThingData ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    },
    body: JSON.stringify(twin)
  }).catch(() => console.log("error"))
}
