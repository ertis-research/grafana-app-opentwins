import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const duplicateTwinService = ( context:IStaticContext, twinId:string, newId:string) => {
    return fetchExtendedApiForDittoService(context, "/twins/" + twinId + "/duplicate/" + newId, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
        }
    })
}