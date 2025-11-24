import { IThingId } from './../interfaces/dittoThing';
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { IDittoThing } from "../interfaces/dittoThing"
import { JsonData } from 'config/AppConfig';

export const splitThingId = (thingId: string): IThingId => {
    const split = thingId.split(":")
    if (split.length === 0) {return {id: "", namespace: ""}}
    if (split.length === 1) {return {id: "", namespace: split[0]}}
    return {
        namespace: split[0],
        id: split.slice(1).join(":")
    }
}

export const getSelectWithObjectsFromThingsArray = (data: IDittoThing[]) => {
    return data.map((item: IDittoThing) => {
        return {
                label : item.thingId,
                value : item
            }
    })
}

export const JSONtoIAttributes = (data: any) => {
    return (Object.keys(data) as string[]).map((key) => (
        {key: key, value:data[key]}
    ))
}

export const JSONtoIFeatures = (data: any) => {
    return (Object.keys(data) as string[]).map((key) => (
        {name: key, properties: data[key].properties}
    ))
}

export const fromMetaToValues = (meta: AppPluginMeta<KeyValue<any>>) => {
    let res: any = {}
    if(meta.jsonData !== undefined){
        const data: JsonData = meta.jsonData
        if(data.dittoURL !== undefined) {res['ditto_endpoint'] = data.dittoURL}
        if(data.dittoUsername !== undefined) {res['ditto_username'] = data.dittoUsername}
        if(data.dittoDevopsUsername !== undefined) {res['ditto_username_devops'] = data.dittoDevopsUsername}
        if(data.extendedURL !== undefined) {res['ditto_extended_endpoint'] = data.extendedURL}
        if(data.agentsURL !== undefined) {res['agent_endpoint'] = data.agentsURL}
        if(data.agentsContext !== undefined) {res['agent_context'] = data.agentsContext}
    }
    return res
}
