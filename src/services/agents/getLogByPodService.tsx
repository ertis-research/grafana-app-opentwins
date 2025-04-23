import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const getLogByPodService = async (context: Context, podId: string) => {
    return fetchAgentsAPIService(context, "/agents/" + podId + "/logs", {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
}
