import { DEFAULT_IMAGE_TWIN } from "utils/data/consts"

export const imageIsUndefined = (url:(string|undefined)) => {
    return (url !== undefined && url !== '') ? url : DEFAULT_IMAGE_TWIN + ''
}

export const defaultIfNoExist = (object: any, attribute: string, _default: any) => {
    return (object !== undefined && object.hasOwnProperty(attribute)) ? object[attribute] : _default
}

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const removeEmptyEntries = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== undefined && v !== ""));
}

export const stringToBoolean = (str: string) => {
    return str.trim().toLowerCase() === "true"
}

export const stringToNumber = (str: string) => {
    return Number(str)
}

export enum enumNotification {
    CONFIRM = "confirm",
    SUCCESS = "success",
    ERROR = "error",
    HIDE = "hide",
    LOADING = "loading",
    READY = "ready"
}

export const enumToList = (e: any) => {
    return Object.entries(e).map(([key, value]) => value as string);
} 

export const enumToISelectList = (e: any) => {
    return Object.entries(e).map(([key, value]) => ({ label: value as string, value: value}))
}
