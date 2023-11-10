import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const unlinkChildrenType = ( context: Context, parentId: string ) => {
  return fetchExtendedApiForDittoService(context, '/types/' + parentId + '/children/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
