import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const unlinkAllParentType = ( context: Context, parentId: string ) => {
  return fetchExtendedApiForDittoService(context, '/types/' + parentId + '/parent/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}
