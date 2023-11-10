import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const unlinkChildrenTypeById = ( context: Context, parentId: string, childId: string ) => {
  return fetchExtendedApiForDittoService(context, '/types/' + parentId + '/children/' + childId + '/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
