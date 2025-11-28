import { SelectableValue } from '@grafana/data'
import { Button, ConfirmModal } from '@grafana/ui'
import React, { useState } from 'react'

/**
 * @name ConnectionActions
 * @description Muestra los botones de acción para una conexión seleccionada (Open/Close, Delete).
 */
interface ConnectionActionsProps {
    selected: SelectableValue<any>;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
    isLoading: boolean;
}

export const ConnectionActions: React.FC<ConnectionActionsProps> = ({ selected, onDelete, onEdit, onToggleStatus, isLoading }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
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
            <Button variant="secondary" style={{ marginRight: '10px' }} icon="edit" onClick={onEdit} disabled={isLoading}>
                Edit
            </Button>
            <Button variant="destructive" icon="trash-alt" onClick={() => setShowDeleteModal(true)} disabled={isLoading}>
                Delete
            </Button>
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete connection"
                body="Are you sure you want to delete this connection? This action cannot be undone."
                confirmText="Confirm Delete"
                icon="exclamation-triangle"
                onConfirm={() => {
                    onDelete(); // Ejecuta la acción real
                    setShowDeleteModal(false); // Cierra el modal
                }}
                onDismiss={() => setShowDeleteModal(false)}
            />
        </div>
    );
}
