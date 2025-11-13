import { AppEvents, SelectableValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Icon, LinkButton, Select } from '@grafana/ui'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { closeConnectionService } from 'services/connections/closeConnectionService'
import { deleteConnectionByIdService } from 'services/connections/deleteConnectionByIdService'
import { getAllConnectionIdsService } from 'services/connections/getAllConnectionsService'
import { enableConnectionLogsService, getLogsByConnectionIdService } from 'services/connections/getLogsByIdService'
import { openConnectionService } from 'services/connections/openConnectionService'
import { getCurrentUserRole, hasAuth, Roles } from 'utils/auxFunctions/auth'
import { StaticContext } from 'utils/context/staticContext'
import { SelectData } from 'utils/interfaces/select'
import { getMetricsByConnectionIdService } from 'services/connections/getMetricsByIdService'
import { getStatusByConnectionIdService } from 'services/connections/getStatusByIdService'
import { DebugInfo, DebugInfoKey } from './ListConnection.types'
import { ConnectionActions } from './ConnectionActions'
import { ConnectionDetails } from './ConnectionDetails'
import { refreshLogsByConnectionIdService } from 'services/connections/refreshLogsService'
import { refreshMetricsByConnectionIdService } from 'services/connections/refreshMetricsService'

interface Parameters {
    path: string
}

export const ListConnections = ({ path }: Parameters) => {

    const context = useContext(StaticContext)
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)
    const [connections, setConnections] = useState<SelectData[]>([])
    const [selected, setSelected] = useState<SelectableValue<any>>()
    const [charging, setCharging] = useState<{ logs: boolean, metrics: boolean, status: boolean }>({ logs: false, metrics: false, status: false })
    const [debugInfo, setDebugInfo] = useState<DebugInfo>()
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const appEvents = getAppEvents()

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
        getAllConnectionIdsService(context).then((res: any[]) => {
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
        serviceCall: (context: any, id: string) => Promise<any>
    ) => {
        if (!selected) { return; }
        const { id } = selected.value;
        const timestamp = Date.now();
        setCharging((prev) => ({ ...prev, [type]: true }));

        try {
            const res: any = await serviceCall(context, id);
            let dataToSet: any;

            if (typeof res === 'string') {
                try { dataToSet = JSON.parse(res); } catch (e) { dataToSet = res; }
            } else {
                dataToSet = res; // Ya es un objeto
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
            // 1. Primer intento de obtener logs
            const res: any = await getLogsByConnectionIdService(context, id);
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

                // 4. Llamamos al servicio para activar logs
                await enableConnectionLogsService(context, id);

                appEvents.publish({
                    type: AppEvents.alertSuccess.name,
                    payload: ["Logs enabled for 24h. Fetching logs again..."],
                });

                // 5. Segundo intento
                const secondRes: any = await getLogsByConnectionIdService(context, id);

                // 6. Mostramos el resultado (con la misma lógica de parseo)
                let secondLogData: any;
                if (typeof secondRes === 'string') {
                    try { secondLogData = JSON.parse(secondRes); } catch (e) { secondLogData = secondRes; }
                } else {
                    secondLogData = secondRes;
                }
                setLogState(secondLogData, Date.now());

            } else {
                setLogState(logData, timestamp); // Pasamos el objeto 'logData'
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
            deleteConnectionByIdService(context, selected.value)
            // Aquí podrías querer llamar a updateConnections() tras el borrado
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
            await serviceToCall(context, id);

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
            setIsTogglingStatus(false); // <-- ¡AQUÍ! Desactivamos al final
        }
    }

    // --- Renderizado ---

    const renderAuthorizedContent = () => (
        <Fragment>
            <div className='row justify-content-between mb-4'>
                <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                    <Select
                        options={connections}
                        value={selected}
                        onChange={v => setSelected(v)}
                        prefix={<Icon name="search" />}
                        placeholder="Search"
                    />
                </div>
                <div className='col-12 col-sm-12 col-md-4 col-lg-4' >
                    {selected && (
                        <ConnectionActions
                            selected={selected}
                            onDelete={handleOnClickDelete}
                            onToggleStatus={handleOnClickStatusConnection}
                            isLoading={isTogglingStatus}
                        />
                    )}
                </div>
                <div className='col-12 col-sm-12 col-md-3 col-lg-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LinkButton variant="primary" href={path + "&mode=create"} icon="plus">
                        Create new connection
                    </LinkButton>
                </div>
            </div>

            {selected && (
                <ConnectionDetails
                    selected={selected}
                    debugInfo={debugInfo}
                    charging={charging}
                    onLoadLogs={handleLoadLogs}
                    onLoadMetrics={handleLoadMetrics}
                    onLoadStatus={handleLoadStatus}
                    onRefreshLogs={handleRefreshLogs}
                    onRefreshMetrics={handleRefreshMetrics}
                />
            )}
        </Fragment>
    );

    const renderNoPermission = () => (
        <div style={{ display: 'flex', justifyItems: 'center', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <h5>You do not have sufficient permissions to access this content</h5>
        </div>
    );

    return (hasAuth(userRole, Roles.EDITOR)) ? renderAuthorizedContent() : renderNoPermission();
}
