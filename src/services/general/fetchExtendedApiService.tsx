import { Context } from "utils/context/staticContext"
import { fetchService } from "./fetchService"

export const fetchExtendedApiForDittoService = ( context: Context, url: string, init: RequestInit, allowNotFound = false ) => {
    if(context.ditto_extended_endpoint !== ''){
        return fetchService(context.ditto_extended_endpoint + url, init, allowNotFound)
    } else {
        throw new Error("Extended API for Eclipse Ditto endpoint not defined")
    }
}
