import { Button, TextArea } from '@grafana/ui'
import React from 'react'
import { DynamicInfo } from 'utils/interfaces/others'

interface DebugInfoPanelProps {
    title: string;
    data?: DynamicInfo;
    isLoading: boolean;
    onLoad: () => void;
    onRefresh?: () => void;
    showRefresh?: boolean; // Para mostrar el botón de refresh
}

/**
 * @name DebugInfoPanel
 * @description Muestra un panel de información (Logs, Metrics, o Status) con sus botones de carga.
 */
export const DebugInfoPanel: React.FC<DebugInfoPanelProps> = ({ title, data, isLoading, onLoad, onRefresh, showRefresh = false }) => {
    const buttonIcon = isLoading ? "spinner" : "history";
    const refreshIcon = isLoading ? "spinner" : "sync";
    const timestamp = data?.timestamp ? new Date(data.timestamp).toLocaleString() : null;
    const content = data?.text ? JSON.stringify(data.text, undefined, 4) : "";

    return (
        <div className="col-12 col-sm-12 col-md-12 col-lg-4">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'stretch' }}>
                <Button
                    style={{ flexGrow: 1 }} // Botón de carga más grande
                    variant='secondary'
                    disabled={isLoading}
                    icon={buttonIcon}
                    onClick={onLoad}
                >
                    Load {title}
                </Button>
                {showRefresh && (
                    <Button
                        variant='secondary'
                        disabled={isLoading}
                        icon={refreshIcon}
                        onClick={onRefresh}
                    >
                        Reset
                    </Button>
                )}
            </div>

            {timestamp ? (
                <p style={{ width: '100%', textAlign: 'end', marginBottom: '0px' }}>
                    Last update at {timestamp}
                </p>
            ) : (
                // Espacio reservado para alinear los TextAreas
                <p style={{ marginBottom: '0px', height: '1.25em' }}>&nbsp;</p>
            )}
            <TextArea rows={22} value={content} readOnly />
        </div>
    );
}
