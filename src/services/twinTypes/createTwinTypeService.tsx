import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"
import { ITwinType } from "utils/interfaces/types"

export const createTwinTypeService = ( twinType : ITwinType ) => {
    return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twintypes", {
      method: 'POST',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(twinType)
    })
}