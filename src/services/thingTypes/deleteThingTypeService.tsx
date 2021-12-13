import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteThingTypeService = (context:IStaticContext, thingTypeId : string ) => {
  return fetchDittoExtendedService(context, "/thingTypes/" + thingTypeId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}