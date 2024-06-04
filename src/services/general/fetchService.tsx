export const fetchService = async ( url: string, init: RequestInit, allowNotFound = false ) => {
    const res = await fetch(url, init)
    console.log("res", res)
    if (!res.ok && !(allowNotFound && res.status === 404)) {throw new Error('Response is NOT ok')}
    try{
        return (allowNotFound && res.status === 404) ? undefined : await res.clone().json()
    } catch(e) {
        return await res.text()
    }
    
}
