import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const unlinkAllChildrenTwinService = (context: Context, twinId: string ) => {
  return fetchExtendedApiForDittoService(context, "/things/" + twinId + '/children/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}
