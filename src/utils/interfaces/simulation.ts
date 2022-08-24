import { TypesContent } from './../data/consts';
import { ContentType, MethodRequest } from "utils/data/consts"

export interface simulationAttributesForm {
    id : string
    description ?: string
    method : MethodRequest
    url : string
    contentType : ContentType
}

export interface simulationAttributes {
    id : string
    description ?: string
    method : MethodRequest
    url : string
    contentType : ContentType
    content : simulationContent[]
}

export interface simulationContent {
    name : string,
    type: TypesContent,
    required : boolean,
    default ?: string
}