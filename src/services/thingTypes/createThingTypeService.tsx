import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IThingType } from "utils/interfaces/types"

export const createThingTypeService = ( context:IStaticContext, thingType : IThingType ) => {
    return fetchDittoExtendedService(context, "/thingtypes", {
      method: 'POST',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(thingType)
    })
}