import React, { useState } from 'react';
import { Button, CustomScrollbar, IconButton, LinkButton, MultiSelect, Tab, TabsBar, TextArea, useStyles2, Badge, Icon } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { AgentInfo, LogEntry } from '../AgentsList.types';
import { SelectData } from 'utils/interfaces/select';
import { CronJobIcon, DeployIcon } from 'img/icons';

interface Props {
    agent: AgentInfo;
    twins: SelectData[];
    latestLogs: LogEntry[];
    isLoadingLog: boolean;
    canEdit: boolean;
    onLoadLog: (podId: string, idx: number) => void;
    onLinkTwins: (ids: string[]) => void;
    onUnlinkTwin: (id: string) => void;
    onNavigateTwin: (id: string) => void;
    onClose: () => void;
}

export const AgentDetails = ({ agent, twins, latestLogs, isLoadingLog, canEdit, onLoadLog, onLinkTwins, onUnlinkTwin, onNavigateTwin, onClose }: Props) => {
    const styles = useStyles2(getStyles);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedTwinsToLink, setSelectedTwinsToLink] = useState<Array<any>>([]);

    const availableTwins = twins.filter(t => !agent.info.twins.includes(t.value));
    const isCron = agent.info.type === 'cronjob';

    return (
        <div className={styles.container}>
            {/* --- HEADER HERO SECTION --- */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.typeBadge}>
                        <span>{agent.info.type.toUpperCase()}</span>
                    </div>
                </div>

                <div className={styles.titleRow}>
                    <div className={styles.bigIcon}>
                        {isCron ? CronJobIcon(styles.iconColor) : DeployIcon(styles.iconColor)}
                    </div>
                    <div className={styles.titleContent}>
                        <h2 className={styles.title}>{agent.info.name}</h2>
                        <div className={styles.subtitle}>
                            <span className={styles.namespace}>{agent.info.namespace}</span>
                            <span className={styles.separator}>/</span>
                            <span className={styles.id}>{agent.info.id}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.statusRow}>
                    <Badge text={agent.info.status} color={agent.info.status === 'Active' ? 'green' : 'orange'} />
                </div>
            </div>

            {/* --- TABS NAVIGATION --- */}
            <div className={styles.tabsContainer}>
                <TabsBar>
                    <Tab label="Overview" active={activeTab === 0} onChangeTab={() => setActiveTab(0)} />
                    <Tab label="Pods & Logs" active={activeTab === 1} onChangeTab={() => setActiveTab(1)} counter={agent.info.pods.length} />
                    <Tab label="Definition" active={activeTab === 2} onChangeTab={() => setActiveTab(2)} />
                </TabsBar>
            </div>

            {/* --- CONTENT SCROLLABLE AREA --- */}
            <CustomScrollbar autoHeightMin="100%">
                <div className={styles.content}>

                    {/* TAB 0: OVERVIEW */}
                    {activeTab === 0 && (
                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>Digital Twins</h4>
                            <div className={styles.twinList}>
                                {agent.info.twins.length === 0 && <div className={styles.emptyText}>No twins linked yet.</div>}
                                {agent.info.twins.map(twin => (
                                    <div key={twin} className={styles.twinItem}>
                                        <div className={styles.twinIcon}><Icon name="arrow-random" /></div>
                                        <LinkButton fill="text" variant="primary" onClick={() => onNavigateTwin(twin)}>
                                            {twin}
                                        </LinkButton>
                                        {canEdit && (
                                            <IconButton aria-labelledby="" name="trash-alt" size="sm" variant="secondary" onClick={() => onUnlinkTwin(twin)} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {canEdit && (
                                <div className={styles.linkBox}>
                                    <MultiSelect
                                        options={availableTwins}
                                        value={selectedTwinsToLink}
                                        onChange={setSelectedTwinsToLink}
                                        placeholder="Link new twins..."
                                    />
                                    <Button
                                        disabled={selectedTwinsToLink.length === 0}
                                        onClick={() => { onLinkTwins(selectedTwinsToLink.map(v => v.value)); setSelectedTwinsToLink([]); }}
                                        variant="secondary"
                                        style={{ marginTop: 8 }}
                                        fullWidth
                                    >
                                        Link Selected Twins
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 1: PODS & LOGS */}
                    {activeTab === 1 && (
                        <div className={styles.section}>
                            {agent.info.pods.map((pod, idx) => (
                                <div key={pod.id} className={styles.podCard}>
                                    <div className={styles.podHeader}>
                                        <div className={styles.podStatus} style={{ backgroundColor: pod.phase === 'Running' ? '#73BF69' : '#F2495C' }} />
                                        <div style={{ flex: 1, fontWeight: 500 }}>{pod.id}</div>
                                        <div style={{ fontSize: 11, color: '#888' }}>{pod.phase}</div>
                                    </div>

                                    <div className={styles.podActions}>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            fill="outline"
                                            icon={isLoadingLog ? "spinner" : "file-alt"}
                                            onClick={() => onLoadLog(pod.podId, idx)}
                                            fullWidth
                                        >
                                            {latestLogs[idx] ? "Refresh Logs" : "Load Logs"}
                                        </Button>
                                    </div>

                                    {latestLogs[idx] && (
                                        <div className={styles.consoleBox}>
                                            <div className={styles.consoleHeader}>
                                                Last update: {new Date(latestLogs[idx].timestamp).toLocaleTimeString()}
                                            </div>
                                            <TextArea className={styles.consoleText} readOnly value={latestLogs[idx].text} rows={10} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 2: DEFINITION */}
                    {activeTab === 2 && (
                        <div className={styles.section}>
                            <TextArea
                                className={styles.consoleText}
                                readOnly
                                value={JSON.stringify(agent.data, null, 2)}
                                rows={30}
                            />
                        </div>
                    )}
                </div>
            </CustomScrollbar>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        display: flex;
        flex-direction: column;
        background-color: ${theme.colors.background.primary};
    `,
    header: css`
        padding: ${theme.spacing(3)};
        background: ${theme.colors.background.primary};
        border-bottom: 1px solid ${theme.colors.border.weak};
    `,
    headerTop: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: ${theme.spacing(2)};
    `,
    typeBadge: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        font-size: 11px;
        font-weight: 600;
        color: ${theme.colors.text.secondary};
        letter-spacing: 1px;
    `,
    titleRow: css`
        display: flex;
        gap: ${theme.spacing(2)};
        align-items: center;
        margin-bottom: ${theme.spacing(2)};
        margin-left: ${theme.spacing(1)};
    `,
    bigIcon: css`
        transform: scale(1.5);
        opacity: 0.9;
    `,
    iconColor: theme.colors.text.primary,
    titleContent: css`
        overflow: hidden;
    `,
    title: css`
        margin: 0;
        font-size: ${theme.typography.h3.fontSize};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
    subtitle: css`
        display: flex;
        align-items: center;
        font-family: ${theme.typography.fontFamilyMonospace};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    namespace: css`color: ${theme.colors.text.primary};`,
    separator: css`margin: 0 4px; color: ${theme.colors.text.disabled};`,
    id: css`color: ${theme.colors.text.secondary};`,

    statusRow: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
    `,
    cronText: css`
        font-size: 12px;
        color: ${theme.colors.text.secondary};
        display: flex;
        align-items: center;
        gap: 6px;
    `,

    tabsContainer: css`
        padding: 0 ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.weak};
    `,
    content: css`
        padding: ${theme.spacing(3)};
    `,
    section: css`
        margin-bottom: ${theme.spacing(3)};
    `,
    sectionTitle: css`
        margin-bottom: ${theme.spacing(2)};
        color: ${theme.colors.text.secondary};
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
    `,

    // Twins
    twinList: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(2)};
    `,
    twinItem: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        padding: ${theme.spacing(1)};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.borderRadius()};
        background: ${theme.colors.background.secondary};
    `,
    twinIcon: css`color: ${theme.colors.text.secondary};`,
    emptyText: css`color: ${theme.colors.text.disabled}; font-style: italic;`,
    linkBox: css`
        border-top: 1px dashed ${theme.colors.border.weak};
        padding-top: ${theme.spacing(2)};
    `,

    // Pods
    podCard: css`
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.borderRadius()};
        margin-bottom: ${theme.spacing(2)};
        overflow: hidden;
    `,
    podHeader: css`
        display: flex;
        align-items: center;
        padding: ${theme.spacing(1)};
        background: ${theme.colors.background.secondary};
        gap: ${theme.spacing(1.5)};
        border-bottom: 1px solid ${theme.colors.border.weak};
    `,
    podStatus: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
    `,
    podActions: css`
        padding: ${theme.spacing(1)};
    `,
    consoleBox: css`
        border-top: 1px solid ${theme.colors.border.weak};
    `,
    consoleHeader: css`
        padding: 4px 8px;
        font-size: 10px;
        color: ${theme.colors.text.secondary};
        background: ${theme.colors.background.primary};
        border-bottom: 1px solid ${theme.colors.border.weak};
        text-align: right;
    `,
    consoleText: css`
        font-family: ${theme.typography.fontFamilyMonospace};
        font-size: 12px;
        border: none;
        background: ${theme.colors.background.primary};
    `
});
