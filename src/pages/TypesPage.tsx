import React, { FC } from 'react';
import { FormThingType } from 'components/types/form/mainThingType';
import { ListTypes } from 'components/types/list/main';
import { AppRootProps } from '@grafana/data'
import { FormTwinType } from 'components/types/form/mainTwinType';
import { fromMetaToValues } from 'utils/aux_functions';
import { StaticContext } from 'utils/context/staticContext';

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const valueMeta = fromMetaToValues(meta)

  var component = <ListTypes path={path} />
  switch (query["mode"]) {
    case "create":
      const obj = query["obj"]
      if(obj === "thing"){
          component = <FormThingType path={path} />
      } else if (obj === "twin") {
          component = <FormTwinType path={path} />
      }
      break
  }

  return (
    <StaticContext.Provider value={valueMeta}>
      {component}
    </StaticContext.Provider>
  )

};