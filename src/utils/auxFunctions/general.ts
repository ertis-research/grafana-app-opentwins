import { DEFAULT_IMAGE_TWIN } from "utils/data/consts"

export const imageIsUndefined = (url:(string|undefined)) => {
    return (url !== undefined && url !== '') ? url : DEFAULT_IMAGE_TWIN + ''
}

export const defaultIfNoExist = (object:any, attribute:string, _default:any) => {
    return (object != undefined && object.hasOwnProperty(attribute)) ? object[attribute] : _default
}