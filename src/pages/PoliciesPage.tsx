import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
import { CreatePolicy } from 'components/policies/form/main'
import { ListPolicies } from 'components/policies/list/main'
import { StaticContext } from 'utils/context/staticContext';
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing';

export const PoliciesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const valueMeta = fromMetaToValues(meta)
  path = path + "?tab=policies"

  var component = <ListPolicies path={path} />
  switch (query["mode"]) {
    case "create":
      component = <CreatePolicy path={path}/>
      break
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )
};
