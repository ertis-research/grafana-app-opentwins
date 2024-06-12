import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const getAllRootTwinsService = async (context: Context) => {
  let res: any[] = []
  
  let twins = await fetchExtendedApiForDittoService(context, "/twins?option=size(200)", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })

  while (twins.hasOwnProperty('cursor')) {
    res = [
      ...res,
      ...twins.items
    ]
    twins = await fetchExtendedApiForDittoService(context, "/twins?option=size(200),cursor(" + twins.cursor + ")", {
      method: 'GET',
      headers: {
        "Authorization": 'Basic ' + btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
  }

  if (twins.hasOwnProperty('items')) {
    res = [
      ...res,
      ...twins.items
    ]
  } else {
    res = [
      ...res,
      ...twins
    ]
  }

  return res
}
