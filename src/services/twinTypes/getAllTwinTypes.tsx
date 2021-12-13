import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const getAllTwinTypesService = (context:IStaticContext) => {
    return fetchDittoExtendedService(context, "/twintypes", {
        method: 'GET',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Accept": "application/json"
        }
    })
}