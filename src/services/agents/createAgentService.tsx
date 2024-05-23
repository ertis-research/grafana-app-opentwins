import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const createAgentService = async (context: Context, id: string, namespace: string, data: any) => {
    return fetchAgentsAPIService(context, "/agent/" + namespace + "/" + id, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}
