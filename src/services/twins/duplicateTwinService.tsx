import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { IStaticContext } from "utils/context/staticContext"

export const duplicateTwinService = ( context:IStaticContext, twinId:string, newId:string, patch?:any) => {
    const body = (patch !== undefined) ? JSON.stringify(patch) : ""
    return fetchExtendedApiForDittoService(context, "/twins/" + twinId + "/duplicate/" + newId, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": 'application/json'
        },
        body: body
    })
}