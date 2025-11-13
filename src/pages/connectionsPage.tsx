// Libraries
import { AppRootProps } from '@grafana/data';
import { CreateFormConnection } from 'components/connections/form';
import { ListConnections } from 'components/connections/list/ListConnections';
import React, { FC } from 'react';
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing';
import { Context, StaticContext } from 'utils/context/staticContext';

export const ConnectionsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  let valueMeta: Context = fromMetaToValues(meta)
  path = path + "?tab=connections"

  let component = <ListConnections path={path} />
  switch (query["mode"]) {
    case "create":
      component = <CreateFormConnection path={path} meta={meta} />
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )
};
