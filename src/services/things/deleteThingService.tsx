import { fetchDittoService } from "services/general/fetchDittoService"

export const deleteThingService = ( thingId : string ) => {
    return fetchDittoService("/things/" + thingId, {
      method: 'DELETE',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      }
    })
}