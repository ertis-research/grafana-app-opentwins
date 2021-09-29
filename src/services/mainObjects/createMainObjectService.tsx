import { fetchDittoService } from "services/general/fetchDittoService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { MAINOBJECTS_THING_IN_DITTO } from "utils/consts"
import { IMainObject } from "utils/interfaces/dittoThing"
import { getMainObjectsService } from "./getMainObjectsService"

export const createMainObjectService = ( mainObject:IMainObject ) => {
  return fetchHonoService("/tenants/"+ mainObject.id, {
    method: 'POST'
  }).then((res:any) => {
    return getMainObjectsService().then(res => {
      res.push(mainObject)
      return fetchDittoService("/things/" + MAINOBJECTS_THING_IN_DITTO + "/attributes/list", {
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
