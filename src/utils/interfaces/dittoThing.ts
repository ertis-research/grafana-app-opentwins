export interface IDittoThing {
    thingId: string,
    policyId: string,
    definition?: string,
    attributes?: JSON,
    features?: JSON
}

export interface IDittoThingSimple {
    thingId: string,
    policyId: string
}

export interface IFeature {
    name: string
    definition?: string[]
    properties?: JSON
    desiredProperties?: JSON
}

export interface IAttribute {
    key: string
    value: string
}

export interface ITwin {
    id: string,
    name: string,
    image?: string,
    description?: string
}