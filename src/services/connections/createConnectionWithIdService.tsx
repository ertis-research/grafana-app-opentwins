import { fetchDittoAPIService } from "services/general/fetchDittoAPIService"
import { Context } from "utils/context/staticContext"

export const createConnectionWithIdService = (context: Context, id: string, data: JSON) => {
    console.log(JSON.stringify(data))
    return fetchDittoAPIService(context, "/connections/" + id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Basic ' + btoa('devops:foobar'),
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })
}
