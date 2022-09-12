import { TypesOfField } from './../data/consts';
import { ContentType, MethodRequest } from "utils/data/consts"

export interface ISimulationAttributesForm {
    id : string
    description ?: string
    method : MethodRequest
    url : string
    hasContent ?: boolean
    contentType ?: ContentType
}

export interface ISimulationAttributes {
    id : string
    description ?: string
    method : MethodRequest
    url : string
    contentType ?: ContentType
    content ?: ISimulationContent[]
}

export interface ISimulationContent {
    name : string,
    type: TypesOfField,
    required : boolean,
    default ?: string
}