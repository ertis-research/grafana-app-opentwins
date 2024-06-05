import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
//import { TwinForm } from 'components/twins/form/main';
import { ListTwins } from 'components/twins/list'
import { StaticContext } from 'utils/context/staticContext'
import { fromMetaToValues } from 'utils/auxFunctions/dittoThing'
import { TwinInfo } from 'components/twins/twinInfo'
import { CreateFormTwin } from 'components/twins/createForm'
import { SimulationForm } from 'components/twins/subcomponents/simulationForm'
import { EditFormTwin } from 'components/twins/editForm'

export const TwinsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const id = query["id"]
  const valueMeta = fromMetaToValues(meta)
  path = path + "?tab=twins"

  let component = <ListTwins path={path} meta={meta} /> //default
  switch (query["mode"]) {
    case "check":
      const section = query["section"]
      if (id !== undefined) { component = <TwinInfo path={path} id={id} meta={meta} section={section}/> }
      break

    case "create":
      switch (query["element"]) {
        case "simulation":
          component = <SimulationForm path={path} id={id} meta={meta} />
          break

        default:
          component = <CreateFormTwin path={path} meta={meta} id={id} />
      }
      break

    case "edit":
      switch (query["element"]) {
        case "simulation":
          const simulationId = query["simulationId"]
          component = <SimulationForm path={path} id={id} meta={meta} simulationId={simulationId} />
          break

        case "twin":
          if (id !== undefined) { component = <EditFormTwin path={path} meta={meta} id={id} /> }
          break
      }
      break
  }



  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )
};
