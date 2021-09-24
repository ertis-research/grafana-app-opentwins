import { fetchHonoService } from "services/general/fetchHonoService"

export const createMainObjectService = ( id:string, name:string, image:string, description:string ) => {

  const data = JSON.parse(
    '{"defaults": { ' +
    '"name" : "' + name + '",' +
    '"image" : "' + image + '",' +
    '"description" : "' + description + '"' +
    '}}'
  )

  return fetchHonoService("/tenants/"+ id, {
    method: 'POST'
  }).then(res => {
    if(res.ok){
      return fetchHonoService("/tenants/"+ id, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
    } else {
      console.log("Error al crear el tenant")
      return []
    }
    
  })

}

