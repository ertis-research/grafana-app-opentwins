import { AppPluginMeta, KeyValue } from '@grafana/data';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { SimulationAttributes } from 'utils/interfaces/simulation';

export interface SimulationListProps {
    meta: AppPluginMeta<KeyValue<any>>;
    id: string;
    twinInfo: IDittoThing;
}

// Renombrado de FormProps a PanelProps
export interface SimulationPanelProps {
    simulation: SimulationAttributes;
    twinId: string;
    onSuccess: () => void; // Para recargar o limpiar selección
    isEditor: boolean;
}

export interface SimulationCardProps {
    simulation: SimulationAttributes;
    isSelected: boolean;
    onClick: (sim: SimulationAttributes) => void;
}
