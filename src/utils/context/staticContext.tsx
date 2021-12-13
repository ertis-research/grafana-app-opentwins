import React from 'react'

export interface IStaticContext {
    ditto_endpoint : string
    ditto_extended_endpoint : string
    hono_endpoint : string
    hono_tenant : string
}

export const StaticContext = React.createContext<IStaticContext>({
    ditto_endpoint: '',
    ditto_extended_endpoint: '',
    hono_endpoint: '',
    hono_tenant: ''
})
