//import { fetchService } from "services/fetch"
import { DITTO_ENDPOINT } from "utils/consts"

export const getTwinsService = async ( id : any ) => {
    const res = await fetch(`${DITTO_ENDPOINT}/search/things?namespaces=`+id, {
      method: 'GET',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Accept": "application/json"
      }
    })
    if (!res.ok) throw new Error('Response is NOT ok')
    return await res.json()
}

/*
export const getTwinsService = ( namespace:string ) => {
  return fetchService("/search/things?namespaces=" + namespace, {
    method: 'GET',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Accept": "application/json"
    }
  })
}*/