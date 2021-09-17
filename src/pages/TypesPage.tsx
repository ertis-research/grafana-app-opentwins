import React, { FC } from 'react';
import { CreateType } from 'components/types/createType';
import { ListTypes } from 'components/types/listTypes';
import { AppRootProps } from '@grafana/data';

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      return (
        <CreateType />
      );
    default:
      return (
        <ListTypes path={path} />
      );
  }

};