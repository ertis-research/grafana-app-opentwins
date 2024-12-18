import { TypesOfField } from './../data/consts';
import { ContentType, MethodRequest } from "utils/data/consts"

export interface SimulationAttributesForm {
    id: string
    description?: string
    method: MethodRequest
    url: string
    hasContent?: boolean
    contentType?: ContentType
}

export interface SimulationAttributes {
    id: string
    description?: string
    method: MethodRequest
    url: string
    contentType?: ContentType
    content?: SimulationContent[]
}

export interface SimulationContent {
    name: string,
    type: TypesOfField,
    required: boolean,
    default?: string
}
