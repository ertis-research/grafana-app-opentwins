import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { Context } from "utils/context/staticContext"

export const closeConnectionService = (context: Context, id: string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/" + id + "/close", {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto')
    }
  })
}
