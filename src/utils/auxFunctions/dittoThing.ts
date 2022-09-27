import { IThingId } from './../interfaces/dittoThing';
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { IDittoThing } from "../interfaces/dittoThing"

export const splitThingId = (thingId:string):IThingId => {
    const split = thingId.split(":")
    if (split.length == 0) return {id: "", namespace: ""}
    if (split.length == 1) return {id: "", namespace: split[0]}
    return {
        namespace: split[0],
        id: split.slice(1).join(":")
    }
}

export const getSelectWithObjectsFromThingsArray = (data:IDittoThing[]) => {
    return data.map((item:IDittoThing) => {
        return {
                label : item.thingId,
                value : item
            }
    })
}

export const JSONtoIAttributes = (data:any) => {
    return (Object.keys(data) as string[]).map((key) => (
        {key: key, value:data[key]}
    ))
}

export const JSONtoIFeatures = (data:any) => {
    return (Object.keys(data) as string[]).map((key) => (
        {name: key, properties: data[key].properties}
    ))
}

export const fromMetaToValues = (meta:AppPluginMeta<KeyValue<any>>) => {
    var res:any = {}
    if(meta.jsonData !== undefined){
        const data = meta.jsonData
        if(data.ditto_endpoint !== undefined) res['ditto_endpoint'] = data.ditto_endpoint
        if(data.ditto_username !== undefined) res['ditto_username'] = data.ditto_username
        if(data.ditto_password !== undefined) res['ditto_password'] = data.ditto_password
        if(data.ditto_username_devops !== undefined) res['ditto_username_devops'] = data.ditto_username_devops
        if(data.ditto_password_devops !== undefined) res['ditto_password_devops'] = data.ditto_password_devops
        if(data.ditto_extended_endpoint !== undefined) res['ditto_extended_endpoint'] = data.ditto_extended_endpoint
        if(data.hono_endpoint !== undefined) res['hono_endpoint'] = data.hono_endpoint + "/v1"
        if(data.hono_tenant !== undefined) res['hono_tenant'] = data.hono_tenant
    }
    return res
}