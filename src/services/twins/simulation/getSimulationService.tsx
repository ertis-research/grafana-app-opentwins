import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { IStaticContext } from "utils/context/staticContext"

export const getSimulationService = (context:IStaticContext, twinId:string, id:string ) => {
    return fetchDittoAPIService(context, "/things/" + twinId + "/attributes/_simulations/" + id, {
        method: 'GET',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Accept": "application/json"
        }
    })
}