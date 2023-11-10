import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const createOrUpdateTwinService = ( context: Context, twinId: string, twin: IDittoThingData ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(twin)
  })
}
