import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { GrafanaTheme2, AppPluginMeta, PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { PluginPage } from '@grafana/runtime';

// Context & Utils
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing';
import { Context, StaticContext } from 'utils/context/staticContext';
import { AgentForm } from 'components/Agents/Form/AgentForm';
import { AgentsList } from 'components/Agents/List/AgentsList';

// Components

// --- Types & Enums ---

export enum AgentsPageMode {
    List = 'list',
    Create = 'create',
}

interface RouteParams {
    id?: string;
}

interface AgentsPageProps {
    meta: AppPluginMeta;
    pageMode?: AgentsPageMode;
}

// --- Component ---

export const AgentsPage = ({ meta, pageMode = AgentsPageMode.List }: AgentsPageProps) => {
    const styles = useStyles2(getStyles);

    const { id } = useParams<RouteParams>();

    const valueMeta: Context = useMemo(() => fromMetaToValues(meta), [meta]);

    const renderContent = () => {
        if (pageMode === AgentsPageMode.Create) {
            return <AgentForm id={id} />;
        }
        return <AgentsList />;
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
    `,
});
