import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const createOrUpdateTypeService = ( context:IStaticContext, typeId:string, type:IDittoThingData ) => {
  return fetchExtendedApiForDittoService(context, "/types/" + typeId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(type)
  })
}