import React, { FC } from 'react'
//import { FormThingType } from 'components/types/form/mainThingType';
import { AppRootProps } from '@grafana/data'
//import { FormTwinType } from 'components/types/form/mainTwinType';
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing'
import { StaticContext } from 'utils/context/staticContext'
import { ListTypes } from 'components/types/list/main'
import { CreateFormType } from 'components/types/form/createForm'

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const id = query["id"]
  const valueMeta = fromMetaToValues(meta)
  path = path + "?tab=types"

  var component = <ListTypes path={path} meta={meta}/> //default
  switch (query["mode"]) {
    case "check":
      if(id !== undefined) component = <div></div>
      break

    case "create":
      component = <CreateFormType path={path} meta={meta} id={id}/>
      break
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )

};