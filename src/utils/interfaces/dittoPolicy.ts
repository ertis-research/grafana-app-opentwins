export interface IPolicy {
    policyId : string,
    entries : IEntry[]
}

export interface IEntry {
    name: string;
    subjects?: ISubject[]
    resources?: IResource[]
}

export interface ISubject {
    subjectIssuer: string
    subject: string
}

export interface IResource {
    name: string | undefined
    description?: string | undefined
    read: boolean | undefined
    write: boolean | undefined
    erasable: boolean
}