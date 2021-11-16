import { ITwin } from "utils/interfaces/dittoThing"
import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"

export const createTwinService = ( twin:ITwin ) => {
  return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twins/" + twin.twinId, {
    method: 'POST',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    },
    body: JSON.stringify(twin)
  }).catch(() => console.log("error"))
}
