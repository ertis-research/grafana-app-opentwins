import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const unlinkAllChildrenTwinService = (context:IStaticContext, twinId : string ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId + '/children/unlink', {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}