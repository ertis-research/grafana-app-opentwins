import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const getTypeService = ( context: Context, typeId: string ) => {
  return fetchExtendedApiForDittoService(context, "/types/" + typeId, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
