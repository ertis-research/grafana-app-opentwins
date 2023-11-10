export const fetchService = async ( url: string, init: RequestInit ) => {
    console.log(init)
    const res = await fetch(url, init)
    console.log(res)
    if (!res.ok) {throw new Error('Response is NOT ok')}
    try{
        return await res.clone().json()
    } catch(e) {
        return await res.text()
    }
    
}
