import { fetchService } from "./fetchService"
import { DITTO_ENDPOINT } from "utils/consts"

export function fetchDittoService( url:string, init:RequestInit ) {
    return fetchService(DITTO_ENDPOINT + url, init)
}