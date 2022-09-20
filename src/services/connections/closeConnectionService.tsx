import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { IStaticContext } from "utils/context/staticContext"

export const closeConnectionService = (context:IStaticContext, id:string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/piggyback/connectivity/" + id + "/close", {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto')
    }
  })
}