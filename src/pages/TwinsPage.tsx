import { AppRootProps } from '@grafana/data';
import { CreateTwin } from 'components/twins/form/main';
import { ListTwins } from 'components/twins/list/main';
import { ListThings } from 'components/things/list/main';
import React, { FC } from 'react';

export const TwinsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "check":
      const id = query["id"]
      if(id !== undefined){
        return (
          <ListThings path={path} id={id}/>
        );
      }
    case "create":
      return (
        <CreateTwin path={path} />
      );
    default:
      return (
        <ListTwins path={path}/>
      );
  }

};
