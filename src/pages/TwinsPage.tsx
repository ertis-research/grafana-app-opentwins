import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
//import { TwinForm } from 'components/twins/form/main';
import { ListTwins } from 'components/twins/list/main'
import { StaticContext } from 'utils/context/staticContext'
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing'
import { TwinInfo } from 'components/twins/list/twinInfo'
import { CreateFormTwin } from 'components/twins/form/createForm'

export const TwinsPage: FC<AppRootProps> = ({ query, path, meta }) => {
  
  const id = query["id"]
  const valueMeta = fromMetaToValues(meta)
  path = path + "?tab=twins"

  var component = <ListTwins path={path} meta={meta}/> //default
  switch (query["mode"]) {
    case "check":
      if(id !== undefined) component = <TwinInfo path={path} id={id} meta={meta}/>
      break

    case "create":
      component = <CreateFormTwin path={path} meta={meta} id={id}/>
      break
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )
};
