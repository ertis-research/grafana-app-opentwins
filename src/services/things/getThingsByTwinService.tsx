import { fetchDittoService } from "services/general/fetchDittoService"
import { IStaticContext } from "utils/context/staticContext"

export const getThingsByTwinService = ( context:IStaticContext, namespace:string ) => {
    return fetchDittoService(context, "/search/things?namespaces=" + namespace, {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
}