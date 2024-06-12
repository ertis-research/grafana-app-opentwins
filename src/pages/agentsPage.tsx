import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
//import { TwinForm } from 'components/twins/form/main';
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing'
import { ListAgents } from 'components/agents/list'
import { CreateFormAgent } from 'components/agents/form'
import { Context, StaticContext } from 'utils/context/staticContext'

export const AgentsPage: FC<AppRootProps> = ({ query, path, meta }) => {

    let valueMeta: Context = fromMetaToValues(meta)
    //path = path + "?tab=agents"
    const id = query["id"]

    let component = <ListAgents path={path} meta={meta} /> //default
    switch (query["mode"]) {
        case "create":
            component = <CreateFormAgent path={path} meta={meta} id={id}/>
    }

    return (
        <StaticContext.Provider value={valueMeta}>
            {component}
        </StaticContext.Provider>
    )
};
