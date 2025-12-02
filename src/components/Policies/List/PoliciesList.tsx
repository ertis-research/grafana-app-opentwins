import React, { useEffect, useState } from 'react';
import { Select, TextArea, Button, Icon, ConfirmModal, useStyles2, Spinner, Alert } from '@grafana/ui';
import { Roles, getCurrentUserRole, hasAuth } from 'utils/auxFunctions/auth';
import { usePolicyLogic } from './usePolicyLogic';
import { PoliciesListProps } from './PoliciesList.types';
import { getStyles } from './PoliciesList.styles';

export const PoliciesList = ({ path }: PoliciesListProps) => {
    const styles = useStyles2(getStyles);
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER);
    
    const {
        policies,
        selectedId,
        setSelectedId,
        selectedPolicyContent,
        newPolicyJson,
        setNewPolicyJson,
        isLoading,
        isProcessing,
        showDeleteModal,
        setShowDeleteModal,
        onDeleteConfirm,
        onSavePolicy,
        onEditPolicy
    } = usePolicyLogic();

    useEffect(() => {
        getCurrentUserRole().then((role: string) => setUserRole(role));
    }, []);

    if (!hasAuth(userRole, Roles.EDITOR)) {
        return (
            <div className={styles.noPermission}>
                <Icon name="lock" size="xxl" style={{ marginBottom: '10px' }} />
                <h3>Access Denied</h3>
                <p>You need editor privileges to manage policies.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainLayout}>
                
                {/* --- LEFT PANEL: VIEW & MANAGE --- */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>Policies List</span>
                        {isLoading && <Spinner size={14} />}
                    </div>
                    
                    {/* Toolbar: Select + Action Buttons */}
                    <div className={styles.toolbar}>
                        <div style={{ flexGrow: 1 }}>
                            <Select
                                options={policies}
                                value={selectedId}
                                onChange={(v) => setSelectedId(v)}
                                prefix={<Icon name="search" />}
                                placeholder="Select policy..."
                                isClearable
                            />
                        </div>
                        
                        {/* Edit Button */}
                        <Button 
                            variant="secondary" 
                            icon="pen" 
                            disabled={!selectedId || isProcessing}
                            onClick={onEditPolicy}
                            tooltip="Copy JSON to create/update panel"
                        >
                            Edit
                        </Button>

                        {/* Delete Button (Full Text) */}
                        <Button 
                            variant="destructive" 
                            icon="trash-alt" 
                            disabled={!selectedId || isProcessing}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete
                        </Button>
                    </div>

                    {/* Read-Only View */}
                    <div className={styles.editorContainer}>
                        <TextArea 
                            className={styles.codeTextArea}
                            value={selectedPolicyContent ? JSON.stringify(selectedPolicyContent, undefined, 4) : ""} 
                            readOnly 
                            placeholder="// Select a policy to view its content"
                        />
                    </div>
                </div>

                {/* --- RIGHT PANEL: CREATE / UPDATE --- */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>Create or Update Policy</span>
                        <Icon name="plus-circle" />
                    </div>

                    {/* Disclaimer Alert */}
                    <div className={styles.disclaimerBox}>
                        <Alert title="Important Configuration" severity="info" className={styles.disclaimerBox}>
                            Please ensure you include the <b>default user</b> (configured in Plugin Settings) 
                            in the <code>entries</code> list. Otherwise, you won't be able to query this policy or its twins.
                        </Alert>
                    </div>

                    <div className={styles.editorContainer}>
                        <TextArea 
                            className={styles.codeTextArea}
                            value={newPolicyJson}
                            onChange={(e) => setNewPolicyJson(e.currentTarget.value)}
                            placeholder={'{\n  "policyId": "example:my-policy",\n  "entries": []\n}'}
                        />
                    </div>

                    <div className={styles.actionsRow}>
                        <Button 
                            variant="primary" 
                            icon={isProcessing ? "spinner" : "save"}
                            onClick={onSavePolicy}
                            disabled={isProcessing || !newPolicyJson}
                        >
                            {isProcessing ? "Saving..." : "Save Policy"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Policy"
                body={`Are you sure you want to delete "${selectedId?.value}"? This action cannot be undone.`}
                confirmText="Delete"
                icon="trash-alt"
                onConfirm={onDeleteConfirm}
                onDismiss={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

