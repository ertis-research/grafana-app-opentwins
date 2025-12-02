import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data';
import { SimulationContent } from 'utils/interfaces/simulation';
import { MethodRequest, ContentType, TypesOfField } from 'utils/data/consts';

export interface SimulationFormProps {
    path: string;
    meta: AppPluginMeta<KeyValue<any>>;
    id: string;
    simulationId?: string;
}

export interface ContentFieldFormData extends SimulationContent {
    typeSelect?: SelectableValue<TypesOfField>; // Helper for the select component
}

export interface SimulationAttributesFormData {
    id: string;
    description?: string;
    url: string;
    method: SelectableValue<MethodRequest>;
    contentType?: SelectableValue<ContentType>;
    hasContent: boolean;
}