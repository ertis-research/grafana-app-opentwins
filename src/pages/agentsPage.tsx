import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
//import { TwinForm } from 'components/twins/form/main';
import { StaticContext } from 'utils/context/staticContext'
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing'
import { ListAgents } from 'components/agents/list'
import { CreateFormAgent } from 'components/agents/form'

export const AgentsPage: FC<AppRootProps> = ({ query, path, meta }) => {

    const valueMeta = fromMetaToValues(meta)
    path = path + "?tab=agents"

    let component = <ListAgents path={path} meta={meta} /> //default
    switch (query["mode"]) {
        case "create":
            component = <CreateFormAgent path={path} meta={meta} />

    }

    return (
        <StaticContext.Provider value={valueMeta}>
            {component}
        </StaticContext.Provider>
    )
};
