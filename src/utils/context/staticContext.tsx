import React from 'react'

export interface Context {
    ditto_endpoint: string
    ditto_username: string
    ditto_password: string
    ditto_username_devops: string
    ditto_password_devops: string
    ditto_extended_endpoint: string
    hono_endpoint: string
    hono_tenant: string
    agent_endpoint: string
    agent_context: string
}

export const StaticContext = React.createContext<Context>({
    ditto_endpoint: '',
    ditto_username : '',
    ditto_password : '',
    ditto_username_devops : '',
    ditto_password_devops : '',
    ditto_extended_endpoint: '',
    hono_endpoint: '',
    hono_tenant: '',
    agent_endpoint: '',
    agent_context: ''
})
