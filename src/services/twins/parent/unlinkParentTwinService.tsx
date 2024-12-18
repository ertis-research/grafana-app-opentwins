import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const unlinkParentTwinService = ( context: Context, twinId: string ) => {
  return fetchExtendedApiForDittoService(context, "/things/" + twinId + '/parent/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
