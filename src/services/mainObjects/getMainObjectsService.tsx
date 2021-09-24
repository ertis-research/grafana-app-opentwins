import { fetchDittoService } from "services/general/fetchDittoService"
import { MAINOBJECTS_THING_IN_DITTO } from "utils/consts"

export const getMainObjectsService = () => {
    return fetchDittoService("/things/" + MAINOBJECTS_THING_IN_DITTO + "/attributes/list", {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
}