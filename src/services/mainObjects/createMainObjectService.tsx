import { fetchService } from "services/fetchService"
import { MAINOBJECTS_THING_IN_DITTO } from "utils/consts"

export const createMainObjectService = ( id:string, name:string, image:string, description:string ) => {
    return fetchService("/things/" + MAINOBJECTS_THING_IN_DITTO + "/attributes/list", {
      method: 'PATCH',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
          '{ ' +
          '"id" : "' + id + '",' +
          '"name" : "' + name + '",' +
          '"image" : "' + image + '",' +
          '"description" : "' + description + '"' +
          ' }'
      )
    })
}