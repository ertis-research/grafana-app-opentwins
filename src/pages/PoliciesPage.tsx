import React from 'react';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { useStyles2, Alert } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';

// Components
import { FormPolicy } from 'components/policies/form/main';
import { ListPolicies } from 'components/policies/list/main';

// --- Types & Enums ---

// Exportamos el Enum para usarlo en App.tsx
export enum PoliciesPageMode {
  List = 'list',
  Create = 'create',
  Edit = 'edit',
}

interface PoliciesPageProps {
  pageMode?: PoliciesPageMode;
}

interface RouteParams {
  id?: string; // Solo capturamos ID, el modo viene por props
}

// --- Component ---

export const PoliciesPage = ({ pageMode = PoliciesPageMode.List }: PoliciesPageProps) => {
  const styles = useStyles2(getStyles);
  
  // Leemos el ID de la URL (si existe)
  const { id } = useParams<RouteParams>();
  
  const BASE_PATH = "policies";

  const renderContent = () => {
    // 1. Modo CREATE
    if (pageMode === PoliciesPageMode.Create) {
      return <FormPolicy path={BASE_PATH} />;
    }

    // 2. Modo EDIT
    if (pageMode === PoliciesPageMode.Edit) {
      if (!id) {
        return <Alert title="Error">Policy ID is required for editing.</Alert>;
      }
      return <FormPolicy path={BASE_PATH} id={id} />;
    }

    // 3. Default: Listado
    return <ListPolicies path={BASE_PATH} />;
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
