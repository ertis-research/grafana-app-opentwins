import { Context } from "utils/context/staticContext"
import { fetchService } from "./fetchService"

export const fetchHonoService = ( context: Context, url: string, init: RequestInit ) => {
    if(context.hono_endpoint !== ''){
        return fetchService(context.hono_endpoint + url, init)
    } else {
        throw new Error("Eclipse Hono endpoint not defined")
    }
}
