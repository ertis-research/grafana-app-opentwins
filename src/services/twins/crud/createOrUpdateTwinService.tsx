import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const createOrUpdateTwinService = ( context:IStaticContext, twinId:string, twin:IDittoThingData ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(twin)
  })
}
