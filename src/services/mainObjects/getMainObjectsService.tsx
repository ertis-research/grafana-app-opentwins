import { fetchService } from "services/fetchService"
import { MAINOBJECTS_THING_IN_DITTO } from "utils/consts"

export const getMainObjectsService = () => {
    return fetchService("/things/" + MAINOBJECTS_THING_IN_DITTO + "/attributes/list", {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
}