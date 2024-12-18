import React, { Fragment } from 'react'
import { Legend, useTheme2 } from '@grafana/ui'

interface Parameters {
    title: string
    description: string
    isLegend: boolean
    className?: string
}

export const ElementHeader = ({className, title, description, isLegend}: Parameters) => {
    
    const LegendOrHeading = () => {
        if(isLegend) {
            return <Legend className={"mb-0 " + className}>{title}</Legend>
        } else {
            return <h4 className={"mb-0 " + className}>{title}</h4>
        }
    }
    
    return (
        <Fragment>
            <LegendOrHeading/>
            <p className="mt-0" style={{color:useTheme2().colors.text.secondary}}>{description}</p>
        </Fragment>
    )
}
