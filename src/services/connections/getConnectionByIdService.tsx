import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { Context } from "utils/context/staticContext"

export const getConnectionByIdService = (context: Context, id: string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/" + id, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
