import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { GrafanaTheme2, AppPluginMeta, PageLayoutType } from '@grafana/data';
import { useStyles2, Alert } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';

// Context & Utils
import { Context, StaticContext } from 'utils/context/staticContext';
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing';

// Components
import { SimulationForm } from 'components/Simulations/Form/SimulationForm';
import { EditFormTwin } from 'components/Twins/Form/editForm';
import { TwinInfo } from 'components/Twins/Info/TwinInfo';
import { CreateFormTwin } from 'components/Twins/Form/createForm';
import { TwinsList } from 'components/Twins/List/TwinsList';

// --- Types & Enums ---

export enum TwinsPageMode {
  List = 'list',
  Check = 'check',
  Create = 'create',
  Edit = 'edit',
}

export enum TwinsElementType {
  Twin = 'twin',
  Simulation = 'simulation',
}

interface RouteParams {
  id?: string;           // ID del Twin principal
  section?: string;      // Para modo Check (ej: 'dashboard', 'details')
  simulationId?: string; // Para modo Edit Simulation
}

interface TwinsPageProps {
  meta: AppPluginMeta;
  pageMode?: TwinsPageMode;
  elementType?: TwinsElementType;
}

// --- Component ---

export const TwinsPage = ({
  meta,
  pageMode = TwinsPageMode.List,
  elementType = TwinsElementType.Twin
}: TwinsPageProps) => {

  const styles = useStyles2(getStyles);
  const BASE_PATH = "twins";
  const { id, section, simulationId } = useParams<RouteParams>();

  const valueMeta: Context = useMemo(() => fromMetaToValues(meta), [meta]);

  const renderContent = () => {
    // ------------------------------------------------
    // 1. Modo CHECK (Ver detalles)
    // ------------------------------------------------
    if (pageMode === TwinsPageMode.Check) {
      if (!id) return <Alert title="Error">Missing Twin ID for check mode.</Alert>;

      return (
        <TwinInfo
          path={BASE_PATH}
          id={id}
          meta={meta}
          section={section}
        />
      );
    }

    // ------------------------------------------------
    // 2. Modo CREATE
    // ------------------------------------------------
    if (pageMode === TwinsPageMode.Create) {
      if (elementType === TwinsElementType.Simulation) {
        if (!id) return <Alert title="Error">Twin ID required to create simulation.</Alert>;
        return <SimulationForm path={BASE_PATH} id={id} meta={meta} />;
      }
      return <CreateFormTwin path={BASE_PATH} meta={meta} id={id} />;
    }

    // ------------------------------------------------
    // 3. Modo EDIT
    // ------------------------------------------------
    if (pageMode === TwinsPageMode.Edit) {
      if (!id) return <TwinsList />; // Fallback seguro

      if (elementType === TwinsElementType.Simulation) {
        return (
          <SimulationForm
            path={BASE_PATH}
            id={id}
            meta={meta}
            simulationId={simulationId}
          />
        );
      }

      // Default: Editar Twin
      return <EditFormTwin path={BASE_PATH} meta={meta} id={id} />;
    }

    // ------------------------------------------------
    // 4. Default: LISTADO
    // ------------------------------------------------
    return <TwinsList />;
  };

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={styles.container}>
        <StaticContext.Provider value={valueMeta}>
          {renderContent()}
        </StaticContext.Provider>
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
    min-height: 100%;
  `,
});
