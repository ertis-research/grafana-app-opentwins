export interface LinkData {
    id: string,
    num: number
}

export interface IThingId {
    id: string,
    namespace: string
}

export interface IDittoThing {
    thingId: string,
    policyId: string,
    attributes?: any,
    features?: any
}

export interface IDittoThingData {
    policyId: string,
    definition?: string,
    attributes?: any,
    features?: any
}

export interface IDittoThingForm {
    namespace: string,
    id: string,
    policyId: string,
    name?: string,
    description?: string,
    image?: string, 
    //definition?: string,
    type?: string
}

export interface IFeature {
    name: string
    definition?: string[]
    properties?: any
    desiredProperties?: any
}

export interface IAttribute {
    key: string
    value: string | any
}
