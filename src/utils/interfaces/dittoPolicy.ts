export interface IPolicy {
    policyId : string,
    entries? : JSON[]
}

export interface IEntry {
    name: string;
    subjects?: ISubject[]
    resources?: IResource[]
}

export interface ISubject {
    subjectIssuer: string
    subject: string
    type: string
}

export interface IResource {
    name: string
    description?: string | undefined
    read: boolean | undefined
    write: boolean | undefined
    erasable: boolean
}