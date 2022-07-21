import { DEFAULT_IMAGE_TWIN } from "utils/data/consts"

export const imageIsUndefined = (url:(string|undefined)) => {
    return (url !== undefined && url !== '') ? url : DEFAULT_IMAGE_TWIN + ''
}

export const defaultIfNoExist = (object:any, attribute:string, _default:any) => {
    return (object != undefined && object.hasOwnProperty(attribute)) ? object[attribute] : _default
}

export const capitalize = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const enumNotification = {
    SUCCESS : "success",
    ERROR : "error",
    HIDE : "hide"
}