import { fetchDittoService } from "services/general/fetchDittoService"
import { IDittoThing } from "utils/interfaces/dittoThing"

export const createTypeService = ( namespace:string, idTwin:string, data:IDittoThing ) => {
    return fetchDittoService("/things/"+ namespace + ":" + idTwin, {
      method: 'PUT',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
}