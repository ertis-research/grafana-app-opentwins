import { SelectableValue } from "@grafana/data";
import { ListAgent } from "utils/interfaces/agents";

export interface AgentsListProps {
    twinId?: string;
}

export interface AgentInfo {
    id: string;
    info: ListAgent;
    data: any; 
}

export interface LogEntry {
    timestamp: number;
    text: string;
}

export interface FilterState {
    search: string;
    type: SelectableValue<string>;
}