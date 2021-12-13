import { ITwin } from "utils/interfaces/dittoThing"
import { ITwinType } from "utils/interfaces/types"
import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const createTwinFromTypeService = ( context:IStaticContext, id : string, type:ITwinType, data?:ITwin ) => {
    const body = (data !== undefined) ? JSON.stringify(data) : ""
    return fetchDittoExtendedService(context, "/twintypes/" + type.twinTypeId + "/twin/" + id, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
        },
        body: body
    }).catch(() => console.log("error"))
}