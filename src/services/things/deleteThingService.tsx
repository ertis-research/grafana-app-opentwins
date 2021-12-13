import { fetchDittoService } from "services/general/fetchDittoService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { IStaticContext } from "utils/context/staticContext"

export const deleteThingService = ( context:IStaticContext,  thingId : string ) => {
    fetchDittoService(context, "/things/" + thingId, {
      method: 'DELETE',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      }
    }).then(() => {
      console.log("/devices/" + context.hono_tenant + "/" + thingId)
      fetchHonoService(context, "/devices/" + context.hono_tenant+ "/" + thingId, {
        method: 'DELETE'
      })
    })
}