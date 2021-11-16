export interface ITwinType {
    twinTypeId: string,
    name: string,
    description: string,
    image: string,
    things: IThingList[]
}

export interface IThingList {
    thingTypeId: string,
    number: number
}

export interface IThingType {
    thingTypeId: string,
    policyId: string,
    description?: string,
    attributes?: JSON,
    features?: JSON
}

export interface IThingTypeSimple {
    thingTypeId: string,
    policyId: string
}