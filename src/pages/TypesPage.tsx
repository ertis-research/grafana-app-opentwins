import React, { FC } from 'react';
import { CreateType } from 'components/Types/CreateType';
import { ListTypes } from 'components/Types/ListTypes';
import { AppRootProps } from '@grafana/data';

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      return (
        //<div></div>
        <CreateType />
      );
    default:
      return (
        <ListTypes path={path} />
      );
  }

};