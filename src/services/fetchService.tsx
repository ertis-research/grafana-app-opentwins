import { DITTO_ENDPOINT } from "utils/consts"

export const fetchService = async ( url:string, init:RequestInit ) => {
    const res = await fetch(`${DITTO_ENDPOINT}` + url, init)
    console.log(res)
    if (!res.ok) throw new Error('Response is NOT ok')
    return await res.json()
}