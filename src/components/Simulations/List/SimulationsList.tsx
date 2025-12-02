import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Button, Input, LinkButton, Icon, useStyles2 } from '@grafana/ui';
import { getCurrentUserRole, isEditor, Roles } from 'utils/auxFunctions/auth';
import { defaultIfNoExist } from 'utils/auxFunctions/general';
import { SimulationAttributes, SimulationContent } from 'utils/interfaces/simulation';

import { SimulationPanel } from './subcomponents/SimulationPanel';
import { SimulationCard } from './subcomponents/SimulationCard';
import { SimulationListProps } from './SimulationsList.types';
import { getStyles } from './SimulationsList.styles';

export const SimulationList = ({ id, twinInfo }: SimulationListProps) => {
    const styles = useStyles2(getStyles);
    const history = useHistory();
    const { url } = useRouteMatch();

    const [selectedSimulation, setSelectedSimulation] = useState<SimulationAttributes | undefined>();
    const [simulations, setSimulations] = useState<SimulationAttributes[]>([]);
    const [userRole, setUserRole] = useState<string>(Roles.VIEWER);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const rawSims = defaultIfNoExist(twinInfo.attributes, "_simulations", {});
        const simsArray = Object.values(rawSims) as SimulationAttributes[];

        const sortedSims = simsArray.map((item) => {
            if (item.content) {
                item.content.sort((a: SimulationContent, b: SimulationContent) =>
                    (a.required === b.required) ? 0 : a.required ? -1 : 1
                );
            }
            return item;
        });

        setSimulations(sortedSims);
        getCurrentUserRole().then(setUserRole);
    }, [twinInfo]);

    const filteredSimulations = useMemo(() => {
        if (!searchQuery) return simulations;
        const query = searchQuery.toLowerCase();
        return simulations.filter(sim =>
            sim.id.toLowerCase().includes(query) ||
            (sim.description && sim.description.toLowerCase().includes(query)) ||
            sim.url.toLowerCase().includes(query)
        );
    }, [simulations, searchQuery]);

    // --- NUEVA LÓGICA DE SELECCIÓN / DESELECCIÓN ---
    const handleSimulationClick = (sim: SimulationAttributes) => {
        if (selectedSimulation?.id === sim.id) {
            setSelectedSimulation(undefined); // Deseleccionar si ya estaba activo
        } else {
            setSelectedSimulation(sim); // Seleccionar nuevo
        }
    };

    const handleNavigateToCreate = () => history.push(`${url}/new`);

    const handleNavigateToOriginalTwin = () => {
        if (twinInfo.attributes?.simulationOf) {
            const basePath = url.split('/twins')[0];
            history.push(`${basePath}/twins/${twinInfo.attributes.simulationOf}`);
        }
    }; 

    if (twinInfo.attributes?.hasOwnProperty("simulationOf")) {
        return (
            <div className={styles.centerContent}>
                <h3>Simulated Twin</h3>
                <p>This twin was created from a simulation. Access the original twin to perform new simulations.</p>
                {twinInfo.attributes?.simulationOf && (
                    <LinkButton icon="external-link-alt" variant="primary" onClick={handleNavigateToOriginalTwin}>
                        Go to {twinInfo.attributes.simulationOf}
                    </LinkButton>
                )}
            </div>
        );
    }

    if (simulations.length === 0) {
        return (
            <div className={styles.centerContent}>
                <h3>No simulations found</h3>
                <p>There are no simulations configured for this twin yet.</p>
                {isEditor(userRole) && (
                    <LinkButton icon="plus" variant="primary" onClick={handleNavigateToCreate}>
                        Add Simulation
                    </LinkButton>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Input
                        prefix={<Icon name="search" />}
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    />
                </div>
                {isEditor(userRole) && (
                    <Button icon="plus" onClick={handleNavigateToCreate}>
                        New Simulation
                    </Button>
                )}
            </div>

            <div className={styles.grid}>
                {/* LISTA 50% */}
                <div className={styles.column}>
                    {filteredSimulations.length > 0 ? (
                        filteredSimulations.map((sim) => (
                            <SimulationCard
                                key={sim.id}
                                simulation={sim}
                                isSelected={selectedSimulation?.id === sim.id}
                                onClick={handleSimulationClick} // Usamos el nuevo handler
                            />
                        ))
                    ) : (
                        <div className={styles.centerMessage} style={{ height: 'auto', marginTop: 40 }}>
                            <p>No results match "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                {/* PANEL 50% */}
                <div className={styles.column}>
                    {selectedSimulation ? (
                        <div className={`${styles.rightColumn}`}>
                            <SimulationPanel
                                key={selectedSimulation.id}
                                simulation={selectedSimulation}
                                twinId={id}
                                isEditor={isEditor(userRole)}
                                onSuccess={() => setSelectedSimulation(undefined)}
                            />
                        </div>
                    ) : (
                        <div className={`${styles.placeholder} ${styles.centerContent}`}>
                            <Icon name="info-circle" size="xl" style={{ marginTop: '10px', opacity: 0.6 }}/>
                            <p style={{ opacity: 0.6}}> Select a simulation from the list to view details and execute.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
