import { IStaticContext } from "utils/context/staticContext"
import { fetchService } from "./fetchService"

export function fetchDittoExtendedService( context:IStaticContext, url:string, init:RequestInit) {
    if(context.ditto_extended_endpoint !== ''){
        return fetchService(context.ditto_extended_endpoint + url, init)
    } else {
        throw new Error("Ditto extended API endpoint not defined")
    }
}