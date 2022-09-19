import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteTwinService = (context:IStaticContext, twinId : string ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}