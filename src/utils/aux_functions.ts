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