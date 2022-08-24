import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const patchTwinService = ( context:IStaticContext, twinId:string, twin:IDittoThingData ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId, {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    },
    body: JSON.stringify(twin)
  })
}