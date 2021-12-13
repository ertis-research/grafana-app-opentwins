import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteTwinTypeService = (context:IStaticContext, twinTypeId : string ) => {
  return fetchDittoExtendedService(context, "/twintypes/" + twinTypeId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}