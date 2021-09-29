import { IDittoThing } from "./interfaces/dittoThing"

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