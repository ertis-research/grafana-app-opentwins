import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { PluginPage } from '@grafana/runtime';

// Page Imports
import { ConnectionPageMode, ConnectionsPage } from 'pages/ConnectionsPage';
import { TwinsElementType, TwinsPage, TwinsPageMode } from 'pages/TwinsPage';
import { PoliciesPage, PoliciesPageMode } from 'pages/PoliciesPage';
import { TypesPage, TypesPageMode } from 'pages/TypesPage';
import { AgentsPage, AgentsPageMode } from 'pages/AgentsPage';
import { AppHeader } from './AppHeader';

export const App = ({ meta }: AppRootProps) => {
  // Hardcoded base path as requested
  const basePath = `/a/${meta.id}`;

  // Debug logging
  // const location = useLocation();
  // console.log('Plugin BasePath:', basePath, '| Current URL:', location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>

      {/* --- AQUI VA EL NUEVO HEADER --- */}
      <AppHeader basePath={basePath}/>
      <Switch>
        {/* =======================================================
          CONNECTIONS
         ======================================================= */}
        <Route path={`${basePath}/connections/new`} render={() => <ConnectionsPage meta={meta} pageMode={ConnectionPageMode.Create} />} />
        <Route path={`${basePath}/connections/:id/edit`} render={() => <ConnectionsPage meta={meta} pageMode={ConnectionPageMode.Edit} />} />
        <Route path={`${basePath}/connections`} render={() => <ConnectionsPage meta={meta} pageMode={ConnectionPageMode.List} />} />

        {/* =======================================================
          TWINS
         ======================================================= */}
        <Route path={`${basePath}/twins/new`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Create} elementType={TwinsElementType.Twin} />} />

        <Route path={`${basePath}/twins/:id/simulations/new`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Create} elementType={TwinsElementType.Simulation} />} />
        <Route path={`${basePath}/twins/:id/simulations/:simulationId/edit`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Edit} elementType={TwinsElementType.Simulation} />} />
        <Route path={`${basePath}/twins/:id/agents/new`} render={() => <AgentsPage meta={meta} pageMode={AgentsPageMode.Create} />} />

        <Route path={`${basePath}/twins/:id/new`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Create} elementType={TwinsElementType.Twin} />} />
        <Route path={`${basePath}/twins/:id/edit`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Edit} elementType={TwinsElementType.Twin} />} />
        <Route path={`${basePath}/twins/:id/:section`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Check} elementType={TwinsElementType.Twin} />} />
        <Route path={`${basePath}/twins/:id`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.Check} elementType={TwinsElementType.Twin} />} />
        <Route path={`${basePath}/twins`} render={() => <TwinsPage meta={meta} pageMode={TwinsPageMode.List} />} />

        {/* =======================================================
          TYPES
         ======================================================= */}
        <Route path={`${basePath}/types/new`} render={() => <TypesPage meta={meta} pageMode={TypesPageMode.Create} />} />
        <Route path={`${basePath}/types/:id/new`} render={() => <TypesPage meta={meta} pageMode={TypesPageMode.Create} />} />
        <Route path={`${basePath}/types/:id/edit`} render={() => <TypesPage meta={meta} pageMode={TypesPageMode.Edit} />} />
        <Route path={`${basePath}/types/:id/:section`} render={() => <TypesPage meta={meta} pageMode={TypesPageMode.Check} />} />
        <Route path={`${basePath}/types/:id`} render={() => <TypesPage meta={meta} pageMode={TypesPageMode.Check} />} />
        <Route path={`${basePath}/types`} render={() => <TypesPage meta={meta} pageMode={TypesPageMode.List} />} />

        {/* =======================================================
          POLICIES
         ======================================================= */}
        <Route path={`${basePath}/policies`} render={() => <PoliciesPage pageMode={PoliciesPageMode.List} />} />

        {/* =======================================================
          AGENTS
         ======================================================= */}
        <Route path={`${basePath}/agents/new`} render={() => <AgentsPage meta={meta} pageMode={AgentsPageMode.Create} />} />
        <Route path={`${basePath}/agents`} render={() => <AgentsPage meta={meta} pageMode={AgentsPageMode.List} />} />

        {/* =======================================================
          DEFAULTS & 404
         ======================================================= */}
        <Route exact path={basePath} render={() => <TwinsPage meta={meta} />} />

        <Route render={() => (
          <PluginPage>
            <div className="page-center">
              <h3>Page not found</h3>
            </div>
          </PluginPage>
        )} />
      </Switch>
    </div>
  );
};

export default App;