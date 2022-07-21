import { fetchExtendedApiForDittoService } from "services/general/fetchDittoExtendedService"
import { IStaticContext } from "utils/context/staticContext"
import { IDittoThingData } from "utils/interfaces/dittoThing"

export const patchTypeService = ( context:IStaticContext, typeId:string, type:IDittoThingData ) => {
    return fetchExtendedApiForDittoService(context, "/types/" + typeId, {
        method: 'PATCH',
        headers: {
            "Authorization": 'Basic '+btoa('ditto:ditto'),
            "Accept": "application/json"
        },
        body: JSON.stringify(type)
    }).catch(() => console.log("error"))
}