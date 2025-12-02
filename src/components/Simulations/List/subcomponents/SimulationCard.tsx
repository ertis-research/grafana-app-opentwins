import React from 'react';
import { Badge, useStyles2, Icon, Tooltip } from '@grafana/ui';
import { getStyles } from '../SimulationsList.styles';
import { SimulationCardProps } from '../SimulationsList.types';
import { cx } from '@emotion/css';

export const SimulationCard = ({ simulation, isSelected, onClick }: SimulationCardProps) => {
    const styles = useStyles2(getStyles);

    const getMethodColor = (method: string) => {
        switch (method?.toUpperCase()) {
            case 'POST': return 'green';
            case 'GET': return 'blue';
            case 'PUT': return 'orange';
            case 'DELETE': return 'red';
            default: return 'darkgrey';
        }
    };

    return (
        <div
            className={cx(styles.cardRow, { [styles.cardRowSelected]: isSelected })}
            onClick={() => onClick(simulation)}
        >
            <div className={styles.cardMainInfo}>
                <div className={styles.cardTitle} title={simulation.id}>
                    {simulation.id}
                </div>
                <div className={styles.cardDescription} title={simulation.description}>
                    {simulation.description || "No description provided"}
                </div>
            </div>

            <div className={styles.cardMeta}>
                <div className={styles.metaRow}>
                    {simulation.contentType && (
                        <Tooltip content={`Content-Type: ${simulation.contentType}`}>
                            <Icon name="file-alt" style={{ opacity: 0.7 }} />
                        </Tooltip>
                    )}
                    <Badge text={simulation.method} color={getMethodColor(simulation.method)} />
                </div>
                <div className={styles.metaRow}>
                    <Tooltip content={simulation.url}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon name="link" style={{ marginRight: 4, opacity: 0.7 }} size="sm" />
                            <span className={styles.urlText}>{simulation.url}</span>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
