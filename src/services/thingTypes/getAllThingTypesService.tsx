import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const getAllThingTypesService = ( context:IStaticContext ) => {
    return fetchDittoExtendedService(context, "/thingTypes", {
        method: 'GET',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Accept": "application/json"
        }
    })
}