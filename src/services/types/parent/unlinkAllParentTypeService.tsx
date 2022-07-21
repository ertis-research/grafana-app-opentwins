import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const unlinkAllParentType = ( context:IStaticContext, parentId:string ) => {
  return fetchExtendedApiForDittoService(context, '/types/' + parentId + '/parent/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}