import { fetchDittoService } from "services/general/fetchDittoService"
import { IStaticContext } from "utils/context/staticContext"

export const getChildrenOfTwinService = ( context:IStaticContext, twinId:string ) => {
  return fetchDittoService(context, '/search/things?filter=and(not(eq(attributes/_isType,true)),eq(attributes/_parents,"' + twinId + '"))', {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}