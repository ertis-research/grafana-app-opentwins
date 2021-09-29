import React, { FC } from 'react';
import { FormType } from 'components/types/form/main';
import { ListTypes } from 'components/types/list/listTypes';
import { AppRootProps } from '@grafana/data'

export const TypesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      return (
        <FormType />
      );
    default:
      return (
        <ListTypes path={path} />
      );
  }

};