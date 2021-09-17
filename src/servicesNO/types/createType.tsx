//import { fetchService } from "services/fetch"
//import { DITTO_ENDPOINT } from "utils/consts"


export const createTypeService = async ( namespace:string, idTwin:string, data:JSON ) => {
    alert(1)
    console.log("HOLA")
    console.log(JSON.stringify(data))
    /*const res = await fetch(`${DITTO_ENDPOINT}/things/`+ namespace + ":" + idTwin, {
      method: 'PUT',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    //console.log(res)
    alert(2)
    if (!res.ok) throw new Error('Response is NOT ok')
    return await res.json()*/
}
/*
export const createTypeService = ( namespace:string, idTwin:string, data:JSON ) => {
  return fetchService("/things/"+ namespace + ":" + idTwin, {
    method: 'PUT',
    headers: {
      "Authorization": 'Basic '+btoa('ditto:ditto'),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}*/