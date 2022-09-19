
import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const getChildrenOfTypeService = ( context:IStaticContext, typeId:string ) => {
  //return fetchDittoService(context, '/search/things?filter=and(eq(attributes/_isType,true),eq(attributes/_parents,"' + typeId + '"))', {
  return fetchExtendedApiForDittoService(context, '/types/' + typeId + '/children', {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}