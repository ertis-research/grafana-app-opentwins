import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const getAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
}
