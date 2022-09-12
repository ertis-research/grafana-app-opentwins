import { stringToBoolean, stringToNumber } from './general';
import { TypesOfField } from "utils/data/consts";
import { ISimulationContent } from "utils/interfaces/simulation";

export const applyTypesOfFields = (data:{[key:string] : any}, content:ISimulationContent[]) => {
    var res = {}
    Object.entries(data).forEach(([key, value]) => {
        var simContent = content.find(t=>t.name === key)
        if (simContent != undefined) {
            res = {
                ...res,
                [key] : valueToType(value as string, simContent.type)
            }
        }
    })
    return res
}

const valueToType = (str:string, type:TypesOfField) => {
    switch (type) {
        case TypesOfField.ARRAY_BOOLEAN:
            return stringToArray(str).map((element:string) => stringToBoolean(element))
        
        case TypesOfField.ARRAY_NUMBER:
            return stringToArray(str).map((element:string) => stringToNumber(element))
        
        case TypesOfField.ARRAY_TEXT:
            return stringToArray(str)

        case TypesOfField.BOOLEAN:
            return stringToBoolean(str)

        case TypesOfField.NUMBER:
            return stringToNumber(str)
    
        default: //TEXT
            return str as string;
    }
}

const stringToArray = (str:string) => {
    return str.split(",")
}