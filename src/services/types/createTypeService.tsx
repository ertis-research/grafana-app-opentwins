import { fetchDittoService } from "services/general/fetchDittoService"
import { TYPES_NAMESPACE_IN_DITTO } from "utils/consts"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const createTypeService = ( {thingId, ...newObj}:IDittoThing ) => {
    return fetchDittoService("/things/"+ TYPES_NAMESPACE_IN_DITTO + ":" + thingId, {
      method: 'PUT',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newObj)
    })
}