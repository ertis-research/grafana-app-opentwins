import { fetchExtendedApiForDittoDevopsService } from "services/general/fetchExtendedApiDevopsService"
import { Context } from "utils/context/staticContext"

export const openConnectionService = (context: Context, id: string) => {
  return fetchExtendedApiForDittoDevopsService(context, "/connections/" + id + "/open", {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto')
    }
  })
}
