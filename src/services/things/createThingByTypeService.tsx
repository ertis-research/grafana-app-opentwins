import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { IStaticContext } from "utils/context/staticContext"

export const createThingByTypeService = ( context:IStaticContext, thingId : string, thingTypeId : string, namespace : string, user : string, password : string ) => {
    return fetchHonoService(context, "/devices/" + context.hono_tenant + "/" + namespace + ":" + thingId, {
        method: 'POST'
    }).then(() => {
        fetchHonoService(context, "/credentials/" + context.hono_tenant + "/" + namespace + ":" + thingId, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
                [{
                    type : "hashed-password",
                    "auth-id" : user,
                    secrets : [{
                        "pwd-plain" : password
                    }]
                }]
            )
        })
    }).then(() => {
        fetchDittoExtendedService(context, "/thingtypes/"+ thingTypeId + "/twin/" + namespace + "/thing/" + thingId, {
            method: 'POST',
            headers: {
              "Authorization": 'Basic '+btoa('ditto:ditto'),
              "Content-Type": "application/json"
            }
        })
    }) 

}