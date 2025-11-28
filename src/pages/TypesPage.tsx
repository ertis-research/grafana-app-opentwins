import React from 'react';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { GrafanaTheme2, AppPluginMeta, PageLayoutType } from '@grafana/data';
import { useStyles2, Alert } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';

// Components
import { ListTypes } from 'components/Types/list';
import { CreateFormType } from 'components/Types/createForm';
import { EditFormType } from 'components/Types/editForm';
import { InfoType } from 'components/Types/Info/InfoType';

// --- Types & Enums ---

export enum TypesPageMode {
  List = 'list',
  Check = 'check', // Ver detalles
  Create = 'create',
  Edit = 'edit',
}

interface RouteParams {
  id?: string;
  section?: string; // Antes era 'extra', ahora es explícito
}

interface TypesPageProps {
  meta: AppPluginMeta;
  pageMode?: TypesPageMode;
}

// --- Component ---

export const TypesPage = ({ meta, pageMode = TypesPageMode.List }: TypesPageProps) => {
  const styles = useStyles2(getStyles);
  
  // URL Params: Solo leemos ID y Section
  const { id, section } = useParams<RouteParams>();
  
  const BASE_PATH = "types";

  const renderContent = () => {
    // 1. Modo CHECK (Info del Type + Section)
    if (pageMode === TypesPageMode.Check) {
      if (!id) {
        return <Alert title="Error">Type ID is required for check mode.</Alert>;
      }
      return (
        <InfoType 
          path={BASE_PATH} 
          id={id} 
          meta={meta} 
          section={section} 
        />
      );
    }

    // 2. Modo CREATE
    if (pageMode === TypesPageMode.Create) {
      // Pasamos 'id' si existe (por si es clonar)
      return <CreateFormType path={BASE_PATH} meta={meta} id={id} />;
    }

    // 3. Modo EDIT
    if (pageMode === TypesPageMode.Edit) {
      if (!id) {
        return <Alert title="Error">Type ID is required for editing.</Alert>;
      }
      return <EditFormType path={BASE_PATH} meta={meta} id={id} />;
    }

    // 4. Default: Listado
    return <ListTypes path={BASE_PATH} meta={meta} />;
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
