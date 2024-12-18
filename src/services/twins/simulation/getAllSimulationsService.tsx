import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getSimulationService = (context: Context, twinId: string, id: string ) => {
    return fetchDittoAPIService(context, "/things/" + twinId + "/attributes/_simulations", {
        method: 'GET',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Accept": "application/json"
        }
    })
}
