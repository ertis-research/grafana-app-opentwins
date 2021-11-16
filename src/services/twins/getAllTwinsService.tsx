import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"

export const getAllTwinsService = () => {
  return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twins", {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  }).catch(() => console.log("error"))
}