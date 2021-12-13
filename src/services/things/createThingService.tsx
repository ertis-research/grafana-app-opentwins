import { fetchDittoService } from "services/general/fetchDittoService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const createThingService = ( context:IStaticContext, {thingId, ...newObj} : IDittoThing, namespace : string, user : string, password : string ) => {
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
        fetchDittoService(context, "/things/"+ namespace + ":" + thingId, {
            method: 'PUT',
            headers: {
              "Authorization": 'Basic '+btoa('ditto:ditto'),
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newObj)
        })
    }) 

}