// Libraries
import { AppRootProps } from '@grafana/data';
import { ConnectionForm } from 'components/connections/Form/ConnectionForm';
import { ListConnections } from 'components/connections/List/ListConnections';
import React, { FC } from 'react';

export const ConnectionsPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const id = query["id"]
  path = path + "?tab=connections"

  let component = <ListConnections path={path} />
  switch (query["mode"]) {
    case "create":
      component = <ConnectionForm path={path} meta={meta} />
    case "edit":
      if (id !== undefined) { component = <ConnectionForm path={path} meta={meta} existingConnectionId={id} /> }
      break
  }

  return component
};
