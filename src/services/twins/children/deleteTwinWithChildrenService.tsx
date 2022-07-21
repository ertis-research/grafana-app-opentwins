import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteTwinWithChildrenService = (context:IStaticContext, twinId : string ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId + "/children", {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}