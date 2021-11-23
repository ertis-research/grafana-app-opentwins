import React, { FC } from 'react';
import { FormThingType } from 'components/types/form/mainThingType';
import { ListTypes } from 'components/types/list/main';
import { AppRootProps } from '@grafana/data'
import { FormTwinType } from 'components/types/form/mainTwinType';

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      const obj = query["obj"]
      if(obj === "thing"){
        return (
          <FormThingType path={path} />
        );
      } else if (obj === "twin") {
        return (
          <FormTwinType path={path} />
        );
      }
      
    default:
      return (
        <ListTypes path={path} />
      );
  }

};