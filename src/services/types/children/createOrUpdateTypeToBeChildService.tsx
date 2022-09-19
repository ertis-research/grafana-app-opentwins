import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const createOrUpdateTypeToBeChildService = ( context:IStaticContext, parentId:string, childId:string, data?:IDittoThingData) => {
    const body = (data !== undefined) ? JSON.stringify(data) : ""
    return fetchExtendedApiForDittoService(context, "/types/" + parentId + "/children/" + childId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": 'application/json; charset=UTF-8'
    },
    body: body
  })
}