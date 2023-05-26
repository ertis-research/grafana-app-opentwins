import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { IStaticContext } from "utils/context/staticContext"

export const getConnectionByIdService = (context:IStaticContext, id:string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/" + id, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}