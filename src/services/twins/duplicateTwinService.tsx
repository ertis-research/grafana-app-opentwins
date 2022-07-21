import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const duplicateTwinService = ( context:IStaticContext, twinId:string, newId:string, data:IDittoThingData ) => {
    return fetchExtendedApiForDittoService(context, "/twins/" + twinId + "/duplicate/" + newId, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }).catch(() => console.log("error"))
}