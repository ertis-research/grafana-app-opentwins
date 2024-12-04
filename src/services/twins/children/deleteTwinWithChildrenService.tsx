import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const deleteTwinWithChildrenService = (context: Context, twinId: string ) => {
  return fetchExtendedApiForDittoService(context, "/things/" + twinId + "/children", {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}
