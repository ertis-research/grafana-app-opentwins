import React, { FC } from 'react'
import { AppRootProps } from '@grafana/data'
import { FormPolicy } from 'components/policies/form/main'
import { ListPolicies } from 'components/policies/list/main'

export const PoliciesPage: FC<AppRootProps> = ({ query, path, meta }) => {

  const id = query["id"]
  path = path + "?tab=policies"

  let component = <ListPolicies path={path} />
  switch (query["mode"]) {
    case "create":
      component = <FormPolicy path={path} />
      break
    case "edit":
      if (id !== undefined) { component = <FormPolicy path={path} id={id} /> }
      break
  }

  return component
};
