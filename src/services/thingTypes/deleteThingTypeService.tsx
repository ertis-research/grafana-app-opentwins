import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"

export const deleteThingTypeService = ( thingTypeId : string ) => {
  return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/thingTypes/" + thingTypeId, {
    method: 'DELETE',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    }
  })
}