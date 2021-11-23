import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"

export const deleteTwinService = ( twinId : string ) => {
  return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twins/" + twinId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}