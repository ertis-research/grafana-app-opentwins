import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const getParentOfTypeService = async ( context: Context, typeId: string ): Promise<{[id: string]: number}|undefined> => {
  return fetchExtendedApiForDittoService(context, "/types/" + typeId + "/parent", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }, true).catch(() => console.log("error"))
}
