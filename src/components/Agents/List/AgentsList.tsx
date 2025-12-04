import React, { useState } from 'react';
import { useStyles2, ConfirmModal, Spinner, Button, Input, Select, Icon, LinkButton } from '@grafana/ui';
import { isEditor } from 'utils/auxFunctions/auth';
import { enumNotification } from 'utils/auxFunctions/general';
import { ListAgent, Types_values } from 'utils/interfaces/agents';

import { useAgentsList } from './useAgentsList';
import { AgentsListProps } from './AgentsList.types';
import { AgentCard } from './subcomponents/AgentCard';
import { AgentDetails } from './subcomponents/AgentDetails';
import { getStyles } from './AgentsList.styles';

export function AgentsList({ twinId }: AgentsListProps) {
    const styles = useStyles2(getStyles);

    // Lógica (Hook)
    const {
        agents, selectedAgent, loadingState, filters, twins, userRole,
        latestLogs, isLogLoading, hasAgents,
        setFilters, setSelectedAgent, handleNavigateToCreate, handleNavigateToTwin,
        handlePausePlay, handleDelete, handleLinkTwins, handleUnlinkTwin, fetchLog
    } = useAgentsList(twinId);

    const [agentToDelete, setAgentToDelete] = useState<ListAgent | undefined>(undefined);
    const canEdit = isEditor(userRole);

    const onConfirmDelete = () => {
        if (agentToDelete) {
            handleDelete(agentToDelete).then(() => setAgentToDelete(undefined));
        }
    };

    // Nueva lógica de selección (Toggle)
    const handleAgentClick = (agent: ListAgent) => {
        if (selectedAgent?.id === agent.id) {
            setSelectedAgent(undefined);
        } else {
            setSelectedAgent(agent);
        }
    };

    // --- RENDERIZADO CONDICIONAL DE ESTADOS DE CARGA/VACÍO ---

    if (loadingState !== enumNotification.READY && !hasAgents) {
        return <div className={styles.loadingContainer}><Spinner size={20} /></div>;
    }

    if (!hasAgents && loadingState === enumNotification.READY) {
        return (
            <div className={styles.centerContent}>
                <h3>No agents found</h3>
                <p>There are no agents configured for this twin yet.</p>
                {canEdit && (
                    <LinkButton icon="plus" variant="primary" onClick={handleNavigateToCreate}>
                        New Agent
                    </LinkButton>
                )}
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* --- TOOLBAR --- */}
            <div className={styles.toolbar}>
                <div className={styles.searchContainer}>
                    <Input
                        prefix={<Icon name="search" />}
                        placeholder="Search..."
                        value={filters.search}
                        onChange={(e) => {
                            const value = e.currentTarget.value;
                            setFilters(prev => ({ ...prev, search: value }));
                        }}
                    />
                </div>
                <div style={{ width: 180 }}>
                    <Select
                        options={Types_values}
                        value={filters.type}
                        onChange={v => setFilters(prev => ({ ...prev, type: v }))}
                        prefix={<Icon name="filter" />}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {canEdit && (
                        <Button icon="plus" onClick={handleNavigateToCreate}>New Agent</Button>
                    )}
                </div>
            </div>

            {/* --- MAIN SPLIT LAYOUT (2/3 Lista - 1/3 Panel) --- */}
            <div className={styles.splitLayout}>

                {/* IZQUIERDA: Grid de Tarjetas */}
                <div className={styles.leftColumn}>
                    <div className={styles.cardsGrid}>
                        {agents.length > 0 ? (
                            agents.map(agent => (
                                <AgentCard
                                    key={agent.id}
                                    agent={agent}
                                    isSelected={selectedAgent?.id === agent.id}
                                    onClick={handleAgentClick}
                                    onPause={handlePausePlay}
                                    onDelete={setAgentToDelete}
                                    canEdit={canEdit}
                                />
                            ))
                        ) : (
                            <div className={styles.centerMessage} style={{ gridColumn: '1 / -1', marginTop: 40 }}>
                                <p>No results match &quot;{filters.search}&quot;</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* DERECHA: Detalles (Responsive) */}
                <div className={styles.rightColumn}>
                    {selectedAgent ? (
                        <div className={styles.detailsContent}>
                            <AgentDetails
                                agent={selectedAgent}
                                twins={twins}
                                latestLogs={latestLogs}
                                isLoadingLog={isLogLoading}
                                canEdit={canEdit}
                                onLoadLog={fetchLog}
                                onLinkTwins={(ids) => handleLinkTwins(selectedAgent.id, selectedAgent.info.namespace, ids)}
                                onUnlinkTwin={(id) => handleUnlinkTwin(selectedAgent.id, selectedAgent.info.namespace, id)}
                                onNavigateTwin={handleNavigateToTwin}
                                onClose={() => setSelectedAgent(undefined)}
                            />
                        </div>
                    ) : (
                        <div className={styles.placeholderContainer}>
                            <div className={styles.placeholderContent}>
                                <Icon name="info-circle" size="xl" style={{ marginBottom: '12px', marginTop: '10px' }} />
                                <p>Select an agent from the list to view its details, logs and configuration.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!agentToDelete}
                title="Delete Agent"
                body={`Are you sure you want to delete ${agentToDelete?.name}?`}
                confirmText="Delete"
                onConfirm={onConfirmDelete}
                onDismiss={() => setAgentToDelete(undefined)}
            />
        </div>
    );
}
