import React, { Fragment, useContext } from 'react'
import { Button } from '@grafana/ui'
import { enumNotification } from 'utils/auxFunctions/general'
import { openConnectionService } from 'services/connections/openConnectionService'
import { closeConnectionService } from 'services/connections/closeConnectionService'
import { StaticContext } from 'utils/context/staticContext'
import { ParametersExtraButtons } from 'components/auxiliary/general/selectWithTextArea'
import { getAppEvents } from '@grafana/runtime'
import { AppEvents } from '@grafana/data'

export const ExtraButtonsConnection = ({selectedConnection, selectedId, isDisabled, setShowNotification}: ParametersExtraButtons) => {
    
    const context = useContext(StaticContext)
    const appEvents = getAppEvents()

    const handleOnClickStatusConnection = () => {
        if(selectedId?.value && selectedConnection && selectedConnection.connectionStatus){
            setShowNotification({state: enumNotification.LOADING, title: ""})
            if(selectedConnection.connectionStatus.toLowerCase() === "closed"){
                openConnectionService(context, selectedId.value).then(() => {
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: ["Connection " + selectedId.value + " opened correctly!"]
                    });
                    setShowNotification({state: enumNotification.READY, title: ""})
                }).catch(() => {
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: ["Error opening connection " + selectedId.value]
                    });
                    setShowNotification({state: enumNotification.READY, title: ""})
                })
            } else {
                closeConnectionService(context, selectedId.value).then(() => {
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: ["Connection " + selectedId.value + " closed correctly!"]
                    });
                    setShowNotification({state: enumNotification.READY, title: ""})
                }).catch(() => {
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: ["Error closing connection " + selectedId.value]
                    });
                    setShowNotification({state: enumNotification.READY, title: ""})
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
