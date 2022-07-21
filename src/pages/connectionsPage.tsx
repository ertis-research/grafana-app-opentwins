// Libraries
import { AppRootProps } from '@grafana/data';
import React, { FC } from 'react';

import { fromMetaToValues } from 'utils/auxFunctions/dittoThing';
import { StaticContext } from 'utils/context/staticContext';

export const ConnectionsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const valueMeta = fromMetaToValues(meta)
  path = path + "?tab=policies"

  var component = <div></div>
  switch (query["mode"]) {
    case "create":
      component = <div></div>
    default:
      component = <div>Connections LIST</div>
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )
};
