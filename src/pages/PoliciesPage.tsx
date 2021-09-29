import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
import { CreatePolicy } from 'components/policies/form/main'
import { ListPolicies } from 'components/policies/list/listPolicies'

export const PoliciesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  switch (query["mode"]) {
    case "create":
      return (
        <CreatePolicy />
      )
      
    default:
      return (
        <ListPolicies path={path} />
      )
  }
};
