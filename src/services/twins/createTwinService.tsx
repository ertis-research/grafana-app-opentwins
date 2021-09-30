import { fetchDittoService } from "services/general/fetchDittoService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { TWINS_THING_IN_DITTO } from "utils/consts"
import { ITwin } from "utils/interfaces/dittoThing"
import { getAllTwinsService } from "./getAllTwinsService"

export const createTwinService = ( twin:ITwin ) => {
  return fetchHonoService("/tenants/"+ twin.id, {
    method: 'POST'
  }).then((res:any) => {
    return getAllTwinsService().then(res => {
      res.push(twin)
      return fetchDittoService("/things/" + TWINS_THING_IN_DITTO + "/attributes/list", {
        method: 'PATCH',
        headers: {
          "Authorization": 'Basic '+btoa('ditto:ditto'),
          "Content-Type": "application/merge-patch+json; charset=UTF-8"
        },
        body: JSON.stringify(res)
      })
    }).catch(() => console.log("error"))
  }).catch(() => console.log("error"))
}
