import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const getParentOfTwinService = ( context: Context, twinId: string ) => {
  return fetchExtendedApiForDittoService(context, "/things/" + twinId + "/parent", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
