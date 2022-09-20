export const APP_TITLE = 'Digital Twins';
export const APP_SUBTITLE = 'App plugin to manage digital twins';

export const KUBERNETES_NAMESPACE = 'cloud2edge'

export const DEFAULT_IMAGE_TWIN = 'https://i.imgur.com/DhxyHBc.png' //'https://cdn.pixabay.com/photo/2020/10/31/19/25/robot-5702074_960_720.png'

export const initResources = [
    {name: "policy:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to the policy itself"},
    {name: "thing:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to all Things referencing this Policy"},
    {name: "message:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to all Messages sent to or from Things referencing this Policy"}
]

export const initSubjects = [{subjectIssuer: "{{ request", subject: "subjectId }}", type:"The creator"}]

export const enumOptions = {
    FROM_TYPE: 0,
    FROM_ZERO: 1
}

export enum ContentType {
    JSON = 'application/json',
    FORM = 'multipart/form-data'
}

export enum MethodRequest {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export enum TypesOfField {
    ARRAY_TEXT = "array(text)",
    ARRAY_NUMBER = "array(number)",
    ARRAY_BOOLEAN ="array(boolean)",
    TEXT = "text",
    NUMBER = "number",
    BOOLEAN = "boolean",
    FILE = "file"
}

export const getPlaceHolderByType = (type:string) => {
    switch(type){
        case TypesOfField.TEXT:
            return "example"
        case TypesOfField.NUMBER:
            return "0"
        case TypesOfField.BOOLEAN:
            return "example"
        case TypesOfField.ARRAY_TEXT:
            return "text, example, hello"
        case TypesOfField.ARRAY_NUMBER:
            return "3, 4, 2, 1, 9"
        case TypesOfField.ARRAY_BOOLEAN:
            return "true, false, false, true"
        default:
            return ""
    }
}

export const options = [
    {label: 'From existing type', value: enumOptions.FROM_TYPE},
    {label: 'From scratch', value: enumOptions.FROM_ZERO}
]