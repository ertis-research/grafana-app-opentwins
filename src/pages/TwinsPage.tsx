import { AppRootProps } from '@grafana/data';
import { CreateMainObject } from 'components/mainObject/createMainObject';
import { ListMainObject } from 'components/mainObject/listMainObject';
import { ListTwins } from 'components/twins/listTwins';
import React, { FC } from 'react';

export const TwinsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "check":
      const id = query["id"]
      if(id !== undefined){
        return (
          <ListTwins path={path} id={id}/>
        );
      }
    case "create":
      return (
        <CreateMainObject />
      );
    default:
      return (
        <ListMainObject path={path}/>
      );
  }

};
