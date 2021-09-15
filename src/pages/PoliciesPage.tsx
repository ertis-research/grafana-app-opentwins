import React, { FC } from 'react';
import { AppRootProps } from '@grafana/data';
import { CreatePolicy } from 'components/Policies/CreatePolicy';
import { ListPolicies } from 'components/Policies/ListPolicies';

export const PoliciesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      return (
        <CreatePolicy />
      );
    default:
      return (
        <ListPolicies path={path} />
      );
  }

};
