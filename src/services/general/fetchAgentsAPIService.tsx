import { Context } from "utils/context/staticContext"
import { fetchService } from "./fetchService"

export function fetchAgentsAPIService( context: Context, url: string, init: RequestInit) {
    if(context.agent_endpoint !== ''){
        return fetchService(context.agent_endpoint + url, init)
    } else {
        throw new Error("Agents API endpoint not defined")
    }
}
