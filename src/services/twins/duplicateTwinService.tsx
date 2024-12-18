import { fetchExtendedApiForDittoService } from "services/general/fetchExtendedApiService"
import { Context } from "utils/context/staticContext"

export const duplicateTwinService = ( context: Context, twinId: string, newId: string, patch?: any) => {
    const body = (patch !== undefined) ? JSON.stringify(patch) : ""
    return fetchExtendedApiForDittoService(context, "/things/" + twinId + "/duplicate/" + newId, {
        method: 'POST',
        headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": 'application/json'
        },
        body: body
    })
}
