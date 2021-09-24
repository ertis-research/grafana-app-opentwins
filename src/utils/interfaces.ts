//DITTO THING
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
        image?: string,
        description?: string
}


//DITTO POLICY
export interface IEntry {
        name: string;
        subjects?: ISubject[]
        resources?: IResource[]
}

export interface ISubject {
        subjectIssuer: string;
        subject: string;
}

export interface IResource {
        name: string | undefined;
        read: boolean | undefined;
        write: boolean | undefined;
}