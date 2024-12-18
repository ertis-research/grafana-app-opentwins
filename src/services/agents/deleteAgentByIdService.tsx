import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const deleteAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id, {
        method: 'DELETE',
        headers: {
            "Accept": "application/json"
        }
    })
}
