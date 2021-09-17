import { fetchService } from "services/fetchService"

export const createTypeService = ( namespace:string, idTwin:string, data:JSON ) => {
    return fetchService("/things/"+ namespace + ":" + idTwin, {
      method: 'PUT',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
}