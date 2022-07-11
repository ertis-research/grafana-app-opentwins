import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const createOrUpdateTwinToBeChildService = ( context:IStaticContext, parentId:string, childId:string, data?:IDittoThing) => {
    const body = (data !== undefined) ? JSON.stringify(data) : ""
    return fetchExtendedApiForDittoService(context, "/twins/" + parentId + "/children/" + childId, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    },
    body: body
  }).catch(() => console.log("error"))
}