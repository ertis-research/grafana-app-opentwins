import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const getAllAgentsService = async (context: Context, twinId?: string) => {
    const namespace = (context.agent_context !== undefined && context.agent_context.trim() !== '') ? ("/" + context.agent_context) : ""
    return fetchAgentsAPIService(context, ("/agents" + namespace + ((twinId !== undefined) ? ("/" + twinId) : "")), {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
}
