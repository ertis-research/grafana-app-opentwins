import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const unlinkChildrenType = ( context:IStaticContext, parentId:string ) => {
  return fetchExtendedApiForDittoService(context, '/types/' + parentId + '/children/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}