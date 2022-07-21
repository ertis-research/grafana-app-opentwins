import { fetchDittoService } from "services/general/fetchDittoService"
import { IStaticContext } from "utils/context/staticContext"

export const getChildrenOfTypeService = ( context:IStaticContext, typeId:string ) => {
  return fetchDittoService(context, '/search/things?filter=and(eq(attributes/_isType,true),eq(attributes/_parents,"' + typeId + '"))', {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}