import React, { FC } from 'react'
//import { FormThingType } from 'components/types/form/mainThingType';
import { AppRootProps } from '@grafana/data'
//import { FormTwinType } from 'components/types/form/mainTwinType';
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing'
import { Context, StaticContext } from 'utils/context/staticContext'
import { ListTypes } from 'components/types/list'
import { CreateFormType } from 'components/types/createForm'
import { TypeInfo } from 'components/types/typeInfo'
import { EditFormType } from 'components/types/editForm'

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const id = query["id"]
  let valueMeta: Context = fromMetaToValues(meta)
  path = path + "?tab=types"

  let component = <ListTypes path={path} meta={meta} /> //default
  switch (query["mode"]) {
    case "check":
      const section = query["section"]
      if (id !== undefined) { component = <TypeInfo path={path} id={id} meta={meta} section={section} /> }
      break

    case "create":
      component = <CreateFormType path={path} meta={meta} id={id} />
      break

    case "edit":
      if (id !== undefined) { component = <EditFormType path={path} meta={meta} id={id} /> }
      break
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )

};
