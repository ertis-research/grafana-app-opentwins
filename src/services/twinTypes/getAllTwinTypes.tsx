import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"

export const getAllTwinTypesService = () => {
    return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twintypes", {
        method: 'GET',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Accept": "application/json"
        }
    })
}