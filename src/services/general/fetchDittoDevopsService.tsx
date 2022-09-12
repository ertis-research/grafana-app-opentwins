import { IStaticContext } from "utils/context/staticContext"
import { fetchService } from "./fetchService"

export function fetchDittoDevopsService( context:IStaticContext, url:string, init:RequestInit) {
    if(context.ditto_endpoint !== ''){
        return fetchService(context.ditto_endpoint + url, init)
    } else {
        throw new Error("Eclipse Ditto endpoint not defined")
    }
}