import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const resumeAgentByIdService = async (context: Context, id: string, namespace: string) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id + "/resume", {
        method: 'POST',
        headers: {
            "Accept": "application/json"
        }
    })
}
