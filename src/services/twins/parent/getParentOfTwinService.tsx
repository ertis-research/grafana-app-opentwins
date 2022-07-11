import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const getParentOfTwinService = ( context:IStaticContext, twinId:string ) => {
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId + "/parent", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}