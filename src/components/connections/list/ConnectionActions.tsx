import { SelectableValue } from '@grafana/data'
import { Button } from '@grafana/ui'
import React from 'react'

/**
 * @name ConnectionActions
 * @description Muestra los botones de acción para una conexión seleccionada (Open/Close, Delete).
 */
interface ConnectionActionsProps {
    selected: SelectableValue<any>;
    onDelete: () => void;
    onToggleStatus: () => void;
    isLoading: boolean;
}

export const ConnectionActions: React.FC<ConnectionActionsProps> = ({ selected, onDelete, onToggleStatus, isLoading }) => {
    if (!selected?.value) {
        return null;
    }

    const { connectionStatus } = selected.value;
    const isConnectionOpen = connectionStatus?.toLowerCase() === 'open';

    let toggleIcon: "spinner" | "lock" | "unlock" = isConnectionOpen ? "lock" : "unlock";
    if (isLoading) {
        toggleIcon = "spinner";
    }

    // 5. Lógica del texto del botón Open/Close
    let toggleText = isConnectionOpen ? 'Close' : 'Open';
    if (isLoading) {
        toggleText = isConnectionOpen ? 'Closing...' : 'Opening...';
    }

    return (
        <div style={{ display: 'flex', justifyItems: 'flex-start', justifyContent: 'flex-start' }}>
            {selected.value.hasOwnProperty('connectionStatus') && (
                <Button
                    style={{ marginRight: '10px' }}
                    variant="secondary"
                    onClick={onToggleStatus}
                    icon={toggleIcon}
                    disabled={isLoading}
                >
                    {toggleText}
                </Button>
            )}
            <Button variant="destructive" icon="trash-alt" onClick={onDelete} disabled={isLoading}>
                Delete
            </Button>
        </div>
    );
}
