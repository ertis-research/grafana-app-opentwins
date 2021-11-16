import { fetchDittoService } from "services/general/fetchDittoService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { NAMESPACE_HONO } from "utils/consts"

export const deleteThingService = ( thingId : string ) => {
    fetchDittoService("/things/" + thingId, {
      method: 'DELETE',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      }
    }).then(() => {
      console.log("/devices/" + NAMESPACE_HONO + "/" + thingId)
      fetchHonoService("/devices/" + NAMESPACE_HONO + "/" + thingId, {
        method: 'DELETE'
      })
    })
}