import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const getParentOfTypeService = ( context:IStaticContext, typeId:string ) => {
  return fetchExtendedApiForDittoService(context, "/types/" + typeId + "/parent", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}