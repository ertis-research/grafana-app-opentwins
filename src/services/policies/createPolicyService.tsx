import { fetchDittoService } from "services/general/fetchDittoService"

export const createPolicyService = ( idPolicy:string, data:JSON ) => {
    return fetchDittoService("/policies/"+ idPolicy, {
      method: 'PUT',
      headers: {
        "Authorization": 'Basic '+btoa('ditto:ditto'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
}