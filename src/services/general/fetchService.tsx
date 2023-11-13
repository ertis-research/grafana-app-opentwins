export const fetchService = async ( url: string, init: RequestInit ) => {
    const res = await fetch(url, init)
    console.log("res", res)
    if (!res.ok) {throw new Error('Response is NOT ok')}
    try{
        return await res.clone().json()
    } catch(e) {
        return await res.text()
    }
    
}
