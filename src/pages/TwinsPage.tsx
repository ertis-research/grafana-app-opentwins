import { AppRootProps } from '@grafana/data';
import { ListMainObject } from 'components/MainObject/ListMainObject';
import { ListTwins } from 'components/Twins/ListTwins';
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
    default:
      return (
        <ListMainObject path={path}/>
      );
  }

};
