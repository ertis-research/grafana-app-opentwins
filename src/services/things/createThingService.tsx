import { fetchDittoService } from "services/general/fetchDittoService"
import { fetchHonoService } from "services/general/fetchHonoService"
import { NAMESPACE_HONO } from "utils/consts"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const createThingService = ( {thingId, ...newObj} : IDittoThing, namespace : string, user : string, password : string ) => {
    return fetchHonoService("/devices/" + NAMESPACE_HONO + "/" + namespace + ":" + thingId, {
        method: 'POST'
    }).then(() => {
        fetchHonoService("/credentials/" + NAMESPACE_HONO + "/" + namespace + ":" + thingId, {
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
        fetchDittoService("/things/"+ namespace + ":" + thingId, {
            method: 'PUT',
            headers: {
              "Authorization": 'Basic '+btoa('ditto:ditto'),
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newObj)
        })
    }) 

}