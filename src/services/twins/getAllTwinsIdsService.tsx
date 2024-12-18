
import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const getAllTwinsIdsService = async (context: Context): Promise<string[]> => {

  let res: string[] = []

  let twins = await fetchDittoAPIService(context, "/search/things?filter=ne(attributes/_isType,true)&fields=thingId&option=size(200)", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic ' + btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })

  while (twins.hasOwnProperty('cursor')) {
    res = [
      ...res,
      ...twins.items.map((item: { thingId: string }) => item.thingId)
    ]
    twins = await fetchDittoAPIService(context, "/search/things?filter=ne(attributes/_isType,true)&fields=thingId&option=size(200),cursor(" + twins.cursor + ")", {
      method: 'GET',
      headers: {
        "Authorization": 'Basic ' + btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
  }

  // Aniado los ultimos items
  if (twins.hasOwnProperty('items')) {
    res = [
      ...res,
      ...twins.items.map((item: { thingId: string }) => item.thingId)
    ]
  } else {
    res = [
      ...res,
      ...twins.map((item: { thingId: string }) => item.thingId)
    ]
  }

  return res
}
