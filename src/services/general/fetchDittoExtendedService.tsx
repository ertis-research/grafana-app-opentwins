import { IStaticContext } from "utils/context/staticContext"
import { fetchService } from "./fetchService"

export function fetchExtendedApiForDittoService( context:IStaticContext, url:string, init:RequestInit) {
    if(context.ditto_extended_endpoint !== ''){
        return fetchService(context.ditto_extended_endpoint + url, init)
    } else {
        throw new Error("Extended API for Eclipse Ditto endpoint not defined")
    }
}