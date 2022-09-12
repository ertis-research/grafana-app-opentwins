import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"

export const patchTwinService = ( context:IStaticContext, twinId:string, twin:any ) => {
  console.log(JSON.stringify(twin))
  return fetchExtendedApiForDittoService(context, "/twins/" + twinId, {
    method: 'PATCH',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(twin)
  })
}