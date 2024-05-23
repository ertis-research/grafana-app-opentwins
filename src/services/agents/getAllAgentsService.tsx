import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const getAllAgentsService = async (context: Context) => {
    return fetchAgentsAPIService(context, "/agents", {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
}
