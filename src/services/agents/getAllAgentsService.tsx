import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const getAllAgentsService = async (context: Context) => {
    const namespace = (context.agent_context !== undefined && context.agent_context.trim() !== '') ? ("/" + context.agent_context) : ""
    return fetchAgentsAPIService(context, ("/agents" + namespace), {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
}
