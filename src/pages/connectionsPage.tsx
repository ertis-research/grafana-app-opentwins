import React, { FC } from 'react';
import { AppRootProps } from '@grafana/data';

export const ConnectionsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      return (
        <div></div>
      );
    default:
      return (
        <div></div>
      );
  }

};