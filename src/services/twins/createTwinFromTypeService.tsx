import { ITwin } from "utils/interfaces/dittoThing"
import { fetchService } from "services/general/fetchService"
import { DITTO_EXTENDED_API_ENDPOINT } from "utils/consts"
import { ITwinType } from "utils/interfaces/types"

export const createTwinFromTypeService = ( id : string, type:ITwinType, data?:ITwin ) => {
    const body = (data !== undefined) ? JSON.stringify(data) : ""
    return fetchService(DITTO_EXTENDED_API_ENDPOINT + "/twintypes/" + type.twinTypeId + "/twin/" + id, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
        },
        body: body
    }).catch(() => console.log("error"))
}