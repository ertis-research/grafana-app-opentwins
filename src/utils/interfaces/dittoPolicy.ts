export interface Policy {
    policyId: string,
    entries?: any[]
}

export interface Entry {
    name: string;
    subjects: Subject[]
    resources: Resource[]
}

export interface Subject {
    subjectIssuer: string
    subject: string
    type: string
}

export interface Resource {
    name: string
    description?: string | undefined
    read: boolean | undefined
    write: boolean | undefined
    erasable: boolean
}
