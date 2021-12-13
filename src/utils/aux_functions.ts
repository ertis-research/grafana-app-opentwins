import { AppPluginMeta, KeyValue } from "@grafana/data"
import { IDittoThing } from "./interfaces/dittoThing"
import { IThingType } from "./interfaces/types"

export const getNameFromDittoThing = (name:string) => {
    const i = name.indexOf(":")
    if(i+1<name.length){
        return name.substring(i+1)
    } else {
        return "unnamed"
    }
}

export const getSelectFromDittoThingArray = (data:IDittoThing[]) => {
    return data.map((item:IDittoThing) => {
        return {
                label : getNameFromDittoThing(item.thingId),
                value : item.thingId,
                text : JSON.stringify(item, undefined, 4)
            }
    })
}

export const getSelectFromThingTypeArray = (data:IThingType[]) => {
    return data.map((item:IThingType) => {
        return {
                label : item.thingTypeId,
                value : item.thingTypeId,
                text : JSON.stringify(item, undefined, 4)
            }
    })
}

export const getSelectWithObjectsFromDittoThingArray = (data:IDittoThing[]) => {
    return data.map((item:IDittoThing) => {
        return {
                label : getNameFromDittoThing(item.thingId),
                value : item
            }
    })
}

export const getSelectWithObjectsFromThingTypesArray = (data:IThingType[]) => {
    return data.map((item:IThingType) => {
        return {
                label : item.thingTypeId,
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
        if(data.ditto_endpoint !== undefined) res['ditto_endpoint'] = data.ditto_endpoint + "/api/2"
        if(data.ditto_extended_endpoint !== undefined) res['ditto_extended_endpoint'] = data.ditto_extended_endpoint + "/api"
        if(data.hono_endpoint !== undefined) res['hono_endpoint'] = data.hono_endpoint + "/v1"
        if(data.hono_tenant !== undefined) res['hono_tenant'] = data.hono_tenant
    }
    return res
}