import { AppEvents, SelectableValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Icon, LinkButton, Select, TextArea, useStyles2 } from '@grafana/ui'
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';

import { getCurrentUserRole, hasAuth, Roles } from 'utils/auxFunctions/auth'
import { SelectData } from 'utils/interfaces/select'
import { closeConnectionService, deleteConnectionByIdService, enableConnectionLogsService, getAllConnectionIdsService, getLogsByConnectionIdService, getMetricsByConnectionIdService, getStatusByConnectionIdService, openConnectionService, refreshLogsByConnectionIdService, refreshMetricsByConnectionIdService } from 'services/ConnectionsService'

import { DebugInfo, DebugInfoKey } from './ConnectionsList.types'
import { getStyles } from './ConnectionsList.styles'
import { ConnectionActions } from './subcomponents/ConnectionActions'
import { DebugInfoPanel } from './subcomponents/DebugInfoPanel'

interface Parameters {
    path: string
}

export const ConnectionsList = ({ path }: Parameters) => {
    const styles = useStyles2(getStyles);
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)
    const [connections, setConnections] = useState<SelectData[]>([])
    const [selected, setSelected] = useState<SelectableValue<any>>()
    const [charging, setCharging] = useState<{ logs: boolean, metrics: boolean, status: boolean }>({ logs: false, metrics: false, status: false })
    const [debugInfo, setDebugInfo] = useState<DebugInfo>()
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const appEvents = getAppEvents()
    const history = useHistory()

    const { url } = useRouteMatch();

    useEffect(() => {
        updateConnections()
        getCurrentUserRole().then((role: string) => setUserRole(role))
    }, [])

    useEffect(() => {
        if (selected && selected.value && selected.value.hasOwnProperty("id")) {
            const refreshSelected = connections.find(v => v.label === selected.value.id)
            setSelected(refreshSelected)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connections])

    useEffect(() => {
        setDebugInfo({ logs: undefined, metrics: undefined, status: undefined })
        setCharging({ logs: false, metrics: false, status: false })
    }, [selected?.value])


    const updateConnections = () => {
        getAllConnectionIdsService().then((res: any[]) => {
            setConnections(res.map((ar: any) => {
                return {
                    label: ar.name,
                    value: ar
                }
            }))
        }).catch(() => {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error fetching connections"],
            });
        })
    }

    const handleDebugData = async (
        type: DebugInfoKey,
        serviceCall: (id: string) => Promise<any>
    ) => {
        if (!selected) { return; }
        const { id } = selected.value;
        const timestamp = Date.now();
        setCharging((prev) => ({ ...prev, [type]: true }));

        try {
            const res: any = await serviceCall(id);
            let dataToSet: any;

            if (typeof res === 'string') {
                try { dataToSet = JSON.parse(res); } catch (e) { dataToSet = res; }
            } else {
                dataToSet = res;
            }

            setDebugInfo((prev) => ({
                ...prev,
                [type]: { timestamp: timestamp, text: dataToSet },
            }));

        } catch (err: any) {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`Error getting the ${type} of connection with id ${id}: ${err.message}`],
            });
        } finally {
            setCharging((prev) => ({ ...prev, [type]: false }));
        }
    };

    const setLogState = (data: any, ts: number) => {
        setDebugInfo((prev) => ({
            ...prev,
            logs: { timestamp: ts, text: data },
        }));
    };

    const handleLoadLogs = async () => {
        if (!selected) { return; }
        const { id } = selected.value;
        const timestamp = Date.now();

        setCharging((prev) => ({ ...prev, logs: true }));

        try {
            const res: any = await getLogsByConnectionIdService(id);
            let logData: any;

            if (typeof res === 'string') {
                try {
                    logData = JSON.parse(res);
                } catch (e) {
                    setLogState(res, timestamp);
                    return;
                }
            } else {
                logData = res;
            }

            if (logData && logData.hasOwnProperty('enabledSince') && logData.enabledSince === null) {
                appEvents.publish({
                    type: AppEvents.alertInfo.name,
                    payload: ["Logs not enabled. Attempting to enable automatically..."],
                });

                await enableConnectionLogsService(id);

                appEvents.publish({
                    type: AppEvents.alertSuccess.name,
                    payload: ["Logs enabled for 24h. Fetching logs again..."],
                });

                const secondRes: any = await getLogsByConnectionIdService(id);
                let secondLogData: any;
                if (typeof secondRes === 'string') {
                    try { secondLogData = JSON.parse(secondRes); } catch (e) { secondLogData = secondRes; }
                } else {
                    secondLogData = secondRes;
                }
                setLogState(secondLogData, Date.now());

            } else {
                setLogState(logData, timestamp);
            }

        } catch (err: any) {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`Error in log retrieval process: ${err.message}`],
            });
        } finally {
            setCharging((prev) => ({ ...prev, logs: false }));
        }
    };

    const handleLoadMetrics = () => handleDebugData('metrics', getMetricsByConnectionIdService);
    const handleRefreshLogs = () => handleDebugData('logs', refreshLogsByConnectionIdService);
    const handleRefreshMetrics = () => handleDebugData('metrics', refreshMetricsByConnectionIdService);
    const handleLoadStatus = () => handleDebugData('status', getStatusByConnectionIdService);

    const handleOnClickDelete = () => {
        if (selected !== undefined && selected.value) {
            deleteConnectionByIdService(selected.value.id)
                .then(() => {
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: [`Connection deleted successfully`]
                    });
                })
                .catch((e: Error) => {
                    let msg = ""
                    try {
                        const response = JSON.parse(e.message)
                        msg = response.message + ". " + response.description
                    } catch (e) { }
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: [`Connection has not been deleted. ` + msg]
                    });
                });
            setSelected({ value: undefined, label: undefined })
            updateConnections()
        }
    }

    const handleOnClickEdit = () => {
        if (selected !== undefined && selected.value && selected.value.id) {
            history.push(`${url}/${selected.value.id}/edit`);
        }
    }

    const handleOnClickStatusConnection = async () => {
        if (!selected?.value?.id || !selected.value.hasOwnProperty("connectionStatus")) {
            return;
        }

        const { id, connectionStatus } = selected.value;
        const isClosed = connectionStatus.toLowerCase() === "closed";
        const serviceToCall = isClosed ? openConnectionService : closeConnectionService;
        const actionText = isClosed ? "opened" : "closed";
        const actionTextGerund = isClosed ? "opening" : "closing";

        setIsTogglingStatus(true);

        try {
            await serviceToCall(id);
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`Connection ${id} ${actionText} correctly!`]
            });
            updateConnections();
        } catch (e: any) {
            console.log(e);
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`Error ${actionTextGerund} connection ${id}: ${e.message}`]
            });
        } finally {
            setIsTogglingStatus(false);
        }
    }

    // --- Renderizado ---

    if (!hasAuth(userRole, Roles.EDITOR)) {
        return (
            <div className={styles.noPermission}>
                <Icon name="lock" size="xxl" style={{ marginBottom: '10px' }} />
                <h5>You do not have sufficient permissions to access this content</h5>
            </div>
        );
    }

    const definition = selected?.value ? JSON.stringify(selected.value, undefined, 2) : '';

    return (
        <div className={styles.container}>
            <div className={styles.mainLayout}>

                {/* --- LEFT PANEL: VIEW, DEFINITION & ACTIONS --- */}
                <div className={styles.leftPanel}>
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>Connections</span>
                        <LinkButton variant="primary" onClick={() => history.push(`${url}/new`)} icon="plus" size="sm">
                            New
                        </LinkButton>
                    </div>

                    <div className={styles.toolbar}>
                        {/* Selector */}
                        <Select
                            options={connections}
                            value={selected}
                            onChange={v => setSelected(v)}
                            prefix={<Icon name="search" />}
                            placeholder="Select connection..."
                        />

                        {/* Action Buttons (Edit, Delete, Open/Close) */}
                        {selected && (
                            <ConnectionActions
                                selected={selected}
                                onEdit={handleOnClickEdit}
                                onDelete={handleOnClickDelete}
                                onToggleStatus={handleOnClickStatusConnection}
                                isLoading={isTogglingStatus}
                            />
                        )}
                    </div>

                    {/* Definition Area */}
                    <div className={styles.editorContainer}>
                        <div className={styles.panelHeader} style={{ marginTop: '16px', fontSize: '14px' }}>
                            <span>Definition</span>
                        </div>
                        <TextArea
                            className={styles.definitionTextArea}
                            value={definition}
                            readOnly
                            placeholder="// Select a connection to view its definition"
                        />
                    </div>
                </div>

                {/* --- RIGHT PANEL: DEBUG INFORMATION --- */}
                <div className={styles.rightPanel}>
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>Debug Information</span>
                        {/* Podrías poner un indicador de carga global aquí si quisieras */}
                    </div>

                    {!selected ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
                            <p>Select a connection to view debug info</p>
                        </div>
                    ) : (
                        <div className={styles.debugGrid}>
                            <div className={styles.debugItem}>
                                <DebugInfoPanel
                                    title="Logs"
                                    data={debugInfo?.logs}
                                    isLoading={charging.logs}
                                    onLoad={handleLoadLogs}
                                    onRefresh={handleRefreshLogs}
                                    showRefresh={true}
                                />
                            </div>
                            <div className={styles.debugItem}>
                                <DebugInfoPanel
                                    title="Metrics"
                                    data={debugInfo?.metrics}
                                    isLoading={charging.metrics}
                                    onLoad={handleLoadMetrics}
                                    onRefresh={handleRefreshMetrics}
                                    showRefresh={true}
                                />
                            </div>
                            <div className={styles.debugItem}>
                                <DebugInfoPanel
                                    title="Status"
                                    data={debugInfo?.status}
                                    isLoading={charging.status}
                                    onLoad={handleLoadStatus}
                                    showRefresh={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
