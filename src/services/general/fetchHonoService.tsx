import { fetchService } from "./fetchService"
import { HONO_ENDPOINT } from "utils/consts"

export function fetchHonoService( url:string, init:RequestInit ) {
    return fetchService(HONO_ENDPOINT + url, init)
}