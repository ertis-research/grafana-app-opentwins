import { AppRootProps } from '@grafana/data';
import { CreateTwin } from 'components/twins/form/main';
import { ListTwins } from 'components/twins/list/main';
import { ListThings } from 'components/things/list/main';
import React, { FC } from 'react';
import { ThingForm } from 'components/things/form/main';

export const TwinsPage: FC<AppRootProps> = ({ query, path, meta }) => {
  
  const id = query["id"]
  switch (query["mode"]) {
    case "check":
      if(id !== undefined){
        return (
          <ListThings path={path} id={id}/>
        );
      }
    case "create":
      if(id !== undefined){
        return (
          <ThingForm path={path} id={id} />
        );
      }else{
        return (
          <CreateTwin path={path} />
        );
      }
    default:
      return (
        <ListTwins path={path}/>
      );
  }

};
