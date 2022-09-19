import { IDittoThingData } from "utils/interfaces/dittoThing"
import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const createTwinFromTypeService = ( context:IStaticContext, twinId : string, typeId : string, data?:IDittoThingData ) => {
    const body = (data !== undefined) ? JSON.stringify(data) : ""
    return fetchExtendedApiForDittoService(context, "/types/" + typeId + "/create/" + twinId, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
        },
        body: body
    })
}