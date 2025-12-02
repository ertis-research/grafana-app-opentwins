import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';
import { PoliciesList } from 'components/Policies/List/PoliciesList';

// Components

// --- Types & Enums ---

// Exportamos el Enum para usarlo en App.tsx
export enum PoliciesPageMode {
  List = 'list'
}

interface PoliciesPageProps {
  pageMode?: PoliciesPageMode;
}


// --- Component ---

export const PoliciesPage = ({ pageMode = PoliciesPageMode.List }: PoliciesPageProps) => {
  const styles = useStyles2(getStyles);
  
  const BASE_PATH = "policies";

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={styles.container}>
        <PoliciesList path={BASE_PATH} />
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
