import { IThingType } from "./types";

export interface IDittoThing {
    thingId: string,
    policyId: string,
    definition?: string,
    attributes?: any,
    features?: any
}

export interface IDittoThingSimple {
    thingId: string,
    policyId: string
}

export interface IDittoThingWithCredentials {
    thingId: string,
    policyId: string,
    password: string,
    type?: IThingType
}

export interface IFeature {
    name: string
    definition?: string[]
    properties?: JSON
    desiredProperties?: JSON
}

export interface IAttribute {
    key: string
    value: string | any
}

export interface ITwin {
    twinId: string,
    name: string,
    type?: string,
    image?: string,
    description?: string
}