import { SelectableValue } from '@grafana/data';

export interface AgentFormProps {
    id?: string;
}

export interface AgentFormData {
    id: string;
    namespace: string;
    data: string; // JSON or YAML in string
    name: string;
    twins: string[];
}

export enum AgentFormat {
    JSON = 'JSON',
    YAML = 'YAML',
}

export const FormatOptions: Array<SelectableValue<AgentFormat>> = [
    { label: AgentFormat.JSON, value: AgentFormat.JSON },
    { label: AgentFormat.YAML, value: AgentFormat.YAML },
];
