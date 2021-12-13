var ditto_endpoint = ""
var hono_endpoint = ""
var ditto_extended_api_endpoint = ""
var hono_tenant = ""

//ECLIPSE DITTO
export const getDittoEndpoint = () => {
    return ditto_endpoint
}

export const setDittoEndpoint = (endpoint : string) => {
    ditto_endpoint = endpoint
}


//DITTO EXTENDED API
export const getDittoExtendedAPIEndpoint = () => {
    return ditto_extended_api_endpoint
}

export const setDittoExtendedAPIEndpoint = (endpoint : string) => {
    ditto_extended_api_endpoint = endpoint
}

//ECLIPSE HONO
export const getHonoEndpoint = () => {
    return hono_endpoint
}

export const setHonoEndpoint = (endpoint : string) => {
    hono_endpoint = endpoint
}

export const getHonoTenant = () => {
    return hono_tenant
}

export const setHonoTenant = (endpoint : string) => {
    hono_tenant = endpoint
}