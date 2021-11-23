import { fetchHonoService } from "services/general/fetchHonoService"
import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT, NAMESPACE_HONO } from "utils/consts"

export const createThingByTypeService = ( thingId : string, thingTypeId : string, namespace : string, user : string, password : string ) => {
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
        fetchService(DITTO_EXTENDED_API_ENDPOINT + "/thingtypes/"+ thingTypeId + "/twin/" + namespace + "/thing/" + thingId, {
            method: 'POST',
            headers: {
              "Authorization": 'Basic '+btoa('ditto:ditto'),
              "Content-Type": "application/json"
            }
        })
    }) 

}