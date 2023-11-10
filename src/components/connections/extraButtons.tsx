import React, { Fragment, useContext } from 'react'
import { Button } from '@grafana/ui'
import { enumNotification } from 'utils/auxFunctions/general'
import { openConnectionService } from 'services/connections/openConnectionService'
import { closeConnectionService } from 'services/connections/closeConnectionService'
import { StaticContext } from 'utils/context/staticContext'
import { ParametersExtraButtons } from 'components/auxiliary/general/selectWithTextArea'

export const ExtraButtonsConnection = ({selectedConnection, selectedId, isDisabled, setShowNotification}: ParametersExtraButtons) => {
    
    const context = useContext(StaticContext)

    const handleOnClickStatusConnection = () => {
        if(selectedId?.value && selectedConnection && selectedConnection.connectionStatus){
            setShowNotification({state: enumNotification.LOADING, title: ""})
            if(selectedConnection.connectionStatus.toLowerCase() === "closed"){
                openConnectionService(context, selectedId.value).then(() => {
                    setShowNotification({
                        state: enumNotification.SUCCESS,
                        title: "Connection " + selectedId.value + " opened correctly!"
                    })
                }).catch(() => {
                    setShowNotification({
                        state: enumNotification.ERROR,
                        title: "Error opening connection " + selectedId.value
                    })
                })
            } else {
                closeConnectionService(context, selectedId.value).then(() => {
                    setShowNotification({
                        state: enumNotification.SUCCESS,
                        title: "Connection " + selectedId.value + " closed correctly!"
                    })
                }).catch(() => {
                    setShowNotification({
                        state: enumNotification.ERROR,
                        title: "Error closing connection " + selectedId.value
                    })
                })
            }
        }
    }
    
    return (selectedConnection.connectionStatus) ? (
        <Fragment>
            <Button variant="secondary" disabled={isDisabled || !selectedConnection.connectionStatus } onClick={handleOnClickStatusConnection} icon={(selectedConnection.connectionStatus.toLowerCase()  === "open") ? "lock" : "unlock"}>{
                (selectedConnection.connectionStatus.toLowerCase()  === "open") ? "Close" : "Open"
            }</Button>
        </Fragment>
    ) : <div></div>
}
