import React, { Fragment } from 'react'
import { Resource_permissions } from './resource_permissions'
import { FormToAddFeatureToResources } from './formToAddFeatureToResources'
import { ElementHeader } from 'components/auxiliary/general/elementHeader'

interface Parameters {
    resources: any
    setResources: any
}

export const FormResources = ({resources, setResources}: Parameters) => {

    const resourceDescription = "Assign the permissions that the subjects will have on each resource"

    return (
        <Fragment>
            <ElementHeader title="Resources" description={resourceDescription} isLegend={false}/>
            {resources.map((item: any) =>
                <Resource_permissions resource={item} resources={resources} setResources={setResources}/>
            )}
            <FormToAddFeatureToResources resources={resources} setResources={setResources}/>
        </Fragment>
    )

}
