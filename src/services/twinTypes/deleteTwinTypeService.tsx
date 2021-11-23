import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"

export const deleteTwinTypeService = ( twinTypeId : string ) => {
  return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twintypes/" + twinTypeId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}