import { SelectableValue } from '@grafana/data'
import { Label, TextArea, useTheme2 } from '@grafana/ui'
import React from 'react'
import { DebugInfoPanel } from './DebugInfoPanel'
import { DebugInfo } from './ListConnection.types';



/**
 * @name ConnectionDetails
 * @description Muestra la definición de la conexión y los paneles de depuración.
 */
interface ConnectionDetailsProps {
    selected: SelectableValue<any>;
    debugInfo?: DebugInfo;
    charging: { logs: boolean; metrics: boolean; status: boolean };
    onLoadLogs: () => void;
    onRefreshLogs: () => void;
    onLoadMetrics: () => void;
    onRefreshMetrics: () => void;
    onLoadStatus: () => void;
}

export const ConnectionDetails: React.FC<ConnectionDetailsProps> = ({
    selected,
    debugInfo,
    charging,
    onLoadLogs,
    onRefreshLogs,
    onLoadMetrics,
    onRefreshMetrics,
    onLoadStatus,
}) => {
    const theme = useTheme2();
    const definition = selected?.value ? JSON.stringify(selected.value, undefined, 4) : '';

    return (
        <div className='row justify-content-between'>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                <Label>Definition</Label>
                <TextArea rows={27} value={definition} readOnly />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-9">
                <Label>Debug</Label>
                <div
                    className="row p-3 pt-4 pb-4"
                    style={{
                        backgroundColor: theme.colors.background.canvas,
                        border: '0.5px solid',
                        borderColor: theme.colors.secondary.borderTransparent,
                    }}
                >
                    <DebugInfoPanel
                        title="Logs"
                        data={debugInfo?.logs}
                        isLoading={charging.logs}
                        onLoad={onLoadLogs}
                        onRefresh={onRefreshLogs}
                        showRefresh={true} // Mostrar refresh para Logs
                    />
                    <DebugInfoPanel
                        title="Metrics"
                        data={debugInfo?.metrics}
                        isLoading={charging.metrics}
                        onLoad={onLoadMetrics}
                        onRefresh={onRefreshMetrics}
                        showRefresh={true} // Mostrar refresh para Metrics
                    />
                    <DebugInfoPanel
                        title="Status"
                        data={debugInfo?.status}
                        isLoading={charging.status}
                        onLoad={onLoadStatus}
                        showRefresh={false} // No mostrar refresh para Status
                    />
                </div>
            </div>
        </div>
    );
}
