import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { IconButton, useStyles2, Icon } from '@grafana/ui';
import { css, cx } from '@emotion/css';
import { ListAgent, AgentState } from 'utils/interfaces/agents';
import { CronJobIcon, DeployIcon } from 'img/icons'; // Tus iconos

interface Props {
    agent: ListAgent;
    isSelected: boolean;
    onClick: (agent: ListAgent) => void;
    onPause: (agent: ListAgent) => void;
    onDelete: (agent: ListAgent) => void;
    canEdit: boolean;
}

export const AgentCard = ({ agent, isSelected, onClick, onPause, onDelete, canEdit }: Props) => {
    const styles = useStyles2(getStyles);
    const isRunning = agent.status === AgentState.ACTIVE;

    return (
        <div 
            className={cx(styles.card, isSelected && styles.selectedCard)}
            onClick={() => onClick(agent)}
        >
            {/* Cabecera compacta: Icono + Título + Acciones */}
            <div className={styles.topRow}>
                <div className={styles.iconArea}>
                     {agent.type === "deployment" ? DeployIcon(styles.iconColor) : CronJobIcon(styles.iconColor)}
                </div>
                
                <div className={styles.titleArea}>
                    <div className={styles.name}>{agent.name}</div>
                    <div className={styles.namespace}>{agent.namespace}</div>
                </div>

                {/* Acciones directas, sin ocupar espacio extra vertical */}
                {canEdit && (
                    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                         <IconButton 
                            name={isRunning ? "pause" : "play"} 
                            size="sm"
                            onClick={() => onPause(agent)} 
                            tooltip={isRunning ? "Pause" : "Resume"}
                        />
                        <IconButton 
                            name="trash-alt" 
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(agent)} 
                            tooltip="Delete"
                        />
                    </div>
                )}
            </div>

            {/* Fila de información inferior */}
            <div className={styles.infoRow}>
                <div className={styles.statusBadge} style={{ color: isRunning ? '#73BF69' : '#FF9830' }}>
                    <Icon name={isRunning ? "heart" : "pause"} size="sm" /> 
                    <span>{agent.status}</span>
                </div>
                <div className={styles.metrics}>
                    <span>Pods: <b>{agent.pods.length}</b></span>
                </div>
            </div>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    card: css`
        background-color: ${theme.colors.background.elevated};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.borderRadius()};
        padding: ${theme.spacing(1.5)}; /* Padding reducido */
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100px; /* Altura compacta */
        position: relative;

        &:hover {
            border-color: ${theme.colors.primary.border};
            background-color: ${theme.colors.background.primary};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.z1};
        }
    `,
    selectedCard: css`
        border-color: ${theme.colors.primary.main};
        background-color: ${theme.colors.action.selected};
        &:hover {
            background-color: ${theme.colors.action.selected};
        }
    `,
    topRow: css`
        display: flex;
        align-items: flex-start;
        gap: ${theme.spacing(1.5)};
        margin-bottom: ${theme.spacing(1)};
    `,
    iconArea: css`
        margin-top: 2px;
        opacity: 0.9;
    `,
    iconColor: theme.colors.text.primary,
    titleArea: css`
        flex: 1;
        overflow: hidden;
    `,
    name: css`
        font-size: ${theme.typography.h6.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.colors.text.primary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
    namespace: css`
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        font-family: ${theme.typography.fontFamilyMonospace};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
    actions: css`
        display: flex;
        gap: 2px;
    `,
    infoRow: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: ${theme.typography.bodySmall.fontSize};
        border-top: 1px solid ${theme.colors.border.weak};
        padding-top: ${theme.spacing(1)};
        margin-top: auto; /* Empuja esto al fondo */
    `,
    statusBadge: css`
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 500;
        text-transform: uppercase;
        font-size: 10px;
    `,
    metrics: css`
        color: ${theme.colors.text.secondary};
    `
});