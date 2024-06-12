export enum PodState {
    PENDING = "Pending",
    RUNNING = "Running",
    SUCCEEDED = "Succeeded",
    FAILED = "Failed",
    UNKNOWN = "Unkhown"
}

export enum AgentState {
    ACTIVE = "Active",
    PAUSED = "Paused"
}

export const Types_values = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Deploy',
        value: 'deployment'
    },
    {
        label: 'CronJob',
        value: 'cronjob'
    }
] 

export interface Pod {
    id: string,
    phase: PodState,
    status: boolean,
    creation_timestamp: string
}

interface BasicAgent {
    id: string,
    name: string,
    namespace: string,
    status: AgentState,
    pods: Pod[]
    twins: string[]
}

interface DeployAgent extends BasicAgent{
    type: "deployment"
}

interface CronJobAgent extends BasicAgent{
    type: "cronjob",
    last_scheduled: string,
    last_scheduled_successful: string,
    schedule: string
}

export type ListAgent = DeployAgent | CronJobAgent
