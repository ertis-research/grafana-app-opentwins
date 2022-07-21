import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const unlinkChildrenTypeById = ( context:IStaticContext, parentId:string, childId:string ) => {
  return fetchExtendedApiForDittoService(context, '/types/' + parentId + '/children/' + childId + '/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}