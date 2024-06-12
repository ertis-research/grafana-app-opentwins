import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const pauseAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id + "/pause", {
        method: 'POST',
        headers: {
            "Accept": "application/json"
        }
    })
}
