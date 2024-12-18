import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const unlinkTwinToAgentService = async (context: Context, id: string, twinId: string, namespace: string) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id + "/twin/" + twinId + "/unlink", {
        method: 'PUT',
        headers: {
            "Accept": "application/json"
        }
    })
}
