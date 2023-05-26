import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { IStaticContext } from "utils/context/staticContext"

export const openConnectionService = (context:IStaticContext, id:string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/" + id + "/open", {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto')
    }
  })
}