import React, { Fragment } from 'react'
import { Legend, useTheme2 } from '@grafana/ui'

interface parameters {
    title : string,
    description : string
    isLegend : boolean
}

export const ElementHeader = ({title, description, isLegend} : parameters) => {
    
    const LegendOrHeading = () => {
        if(isLegend) {
            return <Legend className="mb-0">{title}</Legend>
        } else {
            return <h4 className="mb-0">{title}</h4>
        }
    }
    
    return (
        <Fragment>
            <LegendOrHeading/>
            <p className="mt-0" style={{color:useTheme2().colors.text.secondary}}>{description}</p>
        </Fragment>
    )
}