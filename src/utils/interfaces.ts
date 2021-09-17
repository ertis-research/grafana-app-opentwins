export interface IDittoThing {
        thingId: string,
        policyId: string,
        definition?: string,
        attributes?: JSON,
        features?: JSON
}

export interface IMainObject {
        id: string,
        name: string,
        image: string,
        description: string
}