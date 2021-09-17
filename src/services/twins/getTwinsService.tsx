import { fetchService } from "services/fetchService"

export const getTwinsService = ( namespace:string ) => {
    return fetchService("/search/things?namespaces=" + namespace, {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
}