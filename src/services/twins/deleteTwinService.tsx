import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteTwinService = (context:IStaticContext, twinId : string ) => {
  return fetchDittoExtendedService(context, "/twins/" + twinId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}