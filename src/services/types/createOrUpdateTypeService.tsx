import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const createOrUpdateTypeService = ( context:IStaticContext, type:IDittoThing ) => {
  return fetchExtendedApiForDittoService(context, "/types/" + type.thingId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    },
    body: JSON.stringify(type)
  }).catch(() => console.log("error"))
}