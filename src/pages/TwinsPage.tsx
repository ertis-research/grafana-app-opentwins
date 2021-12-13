import { AppRootProps } from '@grafana/data';
import { CreateTwin } from 'components/twins/form/main';
import { ListTwins } from 'components/twins/list/main';
import { ListThings } from 'components/things/list/main';
import React, { FC } from 'react';
import { ThingForm } from 'components/things/form/main';
import { StaticContext } from 'utils/context/staticContext';
import { fromMetaToValues } from 'utils/aux_functions';

export const TwinsPage: FC<AppRootProps> = ({ query, path, meta }) => {
  
  const id = query["id"]
  const valueMeta = fromMetaToValues(meta)

  var component = <ListTwins path={path} meta={meta}/> //default
  switch (query["mode"]) {
    case "check":
      if(id !== undefined) component = <ListThings path={path} id={id} meta={meta}/>
      break

    case "create":
      if(id !== undefined){
        component = <ThingForm path={path} id={id} meta={meta}/>
      }else{
        component = <CreateTwin path={path} meta={meta}/>
      }
      break
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )
};
