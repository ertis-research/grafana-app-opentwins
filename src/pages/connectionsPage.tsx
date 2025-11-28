import React from 'react';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { GrafanaTheme2, AppPluginMeta, PageLayoutType } from '@grafana/data';
import { useStyles2, Alert } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';

// Components
import { ConnectionForm } from 'components/Connections/Form/ConnectionForm';
import { ListConnections } from 'components/Connections/List/ListConnections';

// --- Types & Enums ---

// Exportamos el Enum para poder usarlo en App.tsx si fuera necesario, 
// o simplemente usamos strings literales en las props.
export enum ConnectionPageMode {
  List = 'list',
  Create = 'create',
  Edit = 'edit',
}

interface ConnectionsPageProps {
  meta: AppPluginMeta;
  // Nueva prop: App.tsx nos dirá explícitamente qué pintar
  pageMode?: ConnectionPageMode; 
}

interface RouteParams {
  id?: string; 
}

// --- Component ---

export const ConnectionsPage = ({ meta, pageMode = ConnectionPageMode.List }: ConnectionsPageProps) => {
  const styles = useStyles2(getStyles);
  
  const { id } = useParams<RouteParams>();
  
  const BASE_PATH = "connections";

  const renderContent = () => {
    // 1. Modo CREATE
    if (pageMode === ConnectionPageMode.Create) {
      return <ConnectionForm path={BASE_PATH} />;
    }

    // 2. Modo EDIT
    if (pageMode === ConnectionPageMode.Edit) {
      if (!id) {
        // Validación de seguridad
        return <Alert title="Error">Connection ID is required for editing.</Alert>;
      }
      return <ConnectionForm path={BASE_PATH} existingConnectionId={id} />;
    }

    // 3. Default: Listado
    return <ListConnections path={BASE_PATH} />;
  };

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={styles.container}>
        {renderContent()}
      </div>
    </PluginPage>
  );
};

// --- Styles ---

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    width: 100%;
  `,
});