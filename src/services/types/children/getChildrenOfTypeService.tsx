
import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const getChildrenOfTypeService = ( context: Context, typeId: string ): Promise<IDittoThing[]> => {
  //return fetchDittoService(context, '/search/things?filter=and(eq(attributes/_isType,true),eq(attributes/_parents,"' + typeId + '"))', {
  return fetchExtendedApiForDittoService(context, '/types/' + typeId + '/children', {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }, true)
}
