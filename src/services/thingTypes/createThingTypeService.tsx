import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"
import { IThingType } from "utils/interfaces/types"

export const createThingTypeService = ( thingType : IThingType ) => {
    return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/thingTypes", {
      method: 'POST',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(thingType)
    })
}