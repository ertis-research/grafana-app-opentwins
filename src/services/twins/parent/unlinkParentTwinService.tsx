import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const unlinkParentTwinService = ( context:IStaticContext, twinId:string ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId + '/parent/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}