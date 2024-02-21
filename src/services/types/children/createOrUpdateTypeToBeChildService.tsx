import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const createOrUpdateTypeToBeChildService = ( context: Context, parentId: string, childId: string, num: number, data?: IDittoThingData) => {
    const body = (data !== undefined) ? JSON.stringify(data) : ""
    return fetchExtendedApiForDittoService(context, "/types/" + parentId + "/children/" + childId + "/" + num, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": 'application/json; charset=UTF-8'
    },
    body: body
  })
}
