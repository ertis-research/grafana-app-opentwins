import { fetchAgentsAPIService } from "services/general/fetchAgentsAPIService"
import { Context } from "utils/context/staticContext"

export const getAllAgentsService = async (context: Context, twinId?: string) => {
    const params: {[key: string]: string} = {}
    if(context.agent_context !== undefined && context.agent_context.trim() !== ''){
        params['context'] = context.agent_context
    }
    if(twinId){
        params['twin'] = twinId
    }

    let paramsToString = ""
    if(Object.keys(params).length > 0){
        paramsToString += "?"
        paramsToString += Object.entries(params).map(([key, value]) => key + "=" + value).join("&")
    }

    return fetchAgentsAPIService(context, ("/agents" + paramsToString), {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
}
