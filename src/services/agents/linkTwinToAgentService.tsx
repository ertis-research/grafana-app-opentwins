import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const linkTwinToAgentService = async (context: Context, id: string, twinId: string, namespace: string) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id + "/twin/" + twinId + "/link", {
        method: 'PUT',
        headers: {
            "Accept": "application/json"
        }
    })
}
