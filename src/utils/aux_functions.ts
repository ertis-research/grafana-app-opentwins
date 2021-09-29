import { IDittoThing } from "./interfaces/dittoThing"
import { ISelect } from "./interfaces/select"

export const getNameFromDittoThing = (name:string) => {
    const i = name.indexOf(":")
    if(i+1<name.length){
        return name.substring(i+1)
    } else {
        return "unnamed"
    }
}

export const getSelectFromDittoThingArray = (data:IDittoThing[]) => {
    var selectArray: ISelect[] = []
    
    data.map((item:IDittoThing) =>
        selectArray.push(
            {
                label : getNameFromDittoThing(item.thingId),
                value : item.thingId,
                text : item.policyId + " " + JSON.stringify(item.attributes).replace(/"/g, '') + " " + JSON.stringify(item.features).replace(/"/g, '')
            }
        )
    )
    
    return selectArray
}