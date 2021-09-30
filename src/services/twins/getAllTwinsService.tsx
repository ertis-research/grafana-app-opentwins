import { fetchDittoService } from "services/general/fetchDittoService"
import { TWINS_THING_IN_DITTO } from "utils/consts"

export const getAllTwinsService = () => {
    return fetchDittoService("/things/" + TWINS_THING_IN_DITTO + "/attributes/list", {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
}