import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteConnectionByIdService = (context:IStaticContext, id:string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/" + id + "/delete", {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}