import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { Context } from "utils/context/staticContext"

export const getAllConnectionIdsService = (context: Context) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/ids", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}
