import React from 'react'
import { ConfirmModal, Modal, Spinner } from '@grafana/ui'
import { enumNotification } from 'utils/auxFunctions/general'
import { Notification } from 'utils/interfaces/notification'

interface Parameters {
    notification: Notification
    setNotificationFunc: React.Dispatch<React.SetStateAction<Notification>>
}

export const CustomNotification = ({ notification, setNotificationFunc }: Parameters) => {

    const hideNotification = () => {
        if (notification.onDismissFunc) { notification.onDismissFunc() }
        setNotificationFunc({ state: enumNotification.HIDE, title: "" })
    }

    switch (notification.state) {
        case enumNotification.CONFIRM:
            if (notification.confirmText && notification.onConfirmFunc) {
                return <ConfirmModal
                    isOpen={true}
                    title={(notification.title) ? notification.title : ""}
                    body={notification.body}
                    description={notification.description}
                    confirmText={notification.confirmText}
                    alternativeText={notification.alternativeText}
                    dismissText={notification.dismissText}
                    onAlternative={notification.onAlternativeFunc}
                    onDismiss={hideNotification}
                    onConfirm={notification.onConfirmFunc}
                />
            }
        case enumNotification.SUCCESS || enumNotification.ERROR:
            return <Modal
                title={(notification.title) ? notification.title : ""}
                isOpen={true}
                onDismiss={hideNotification}>
                {notification.description}
            </Modal>

        case enumNotification.LOADING:
            return <div className="mb-0 mt-4" style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Spinner inline={true} size={20} />
            </div>

        default:
            return <div></div>
    }

}
