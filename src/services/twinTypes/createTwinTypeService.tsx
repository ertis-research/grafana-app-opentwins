import { fetchDittoExtendedService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { ITwinType } from "utils/interfaces/types"

export const createTwinTypeService = (context:IStaticContext, twinType : ITwinType ) => {
    return fetchDittoExtendedService(context, "/twintypes", {
      method: 'POST',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(twinType)
    })
}