import { Button, ConfirmModal, Modal, Spinner } from "@grafana/ui"
import React, { useState, useContext, Fragment, useEffect } from "react"
import { getCurrentUserRole, isEditor, Roles } from "utils/auxFunctions/auth"
import { enumNotification } from "utils/auxFunctions/general"
import { StaticContext } from "utils/context/staticContext"

interface Parameters {
    path: string
    thingId: string
    isType: boolean
    funcDelete: any
    funcDeleteChildren?: any
}

export const ButtonsInfo = ({ path, thingId, isType, funcDelete, funcDeleteChildren }: Parameters) => {
    const title = (isType) ? "type" : "twin"
    const messageDelete = `Delete ${title}`
    const descriptionDelete = `Are you sure you want to remove the ${title} with id `
    const descriptionDeleteChildren = "Choose if you want to remove the twin alone, unlinking its children, or remove the twin and all its children."
    const messageSuccess = `The ${title} has been deleted correctly.`
    const messageError = `The ${title} has not been deleted correctly.`
    const descriptionError = "Refresh the page or check for errors."

    const context = useContext(StaticContext)

    const [userRole, setUserRole] = useState<string>(Roles.VIEWER)
    const [showDeleteModal, setShowDeleteModal] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)

    useEffect(() => {
        getCurrentUserRole().then((role: string) => setUserRole(role))
    }, [])

    const hideNotification = (success: boolean) => {
        setShowDeleteModal(undefined)
        setShowNotification(enumNotification.HIDE)
        if (success) {
            window.location.replace(path + "?tab=" + title + "s")
        }
    }

    const deleteThing = (funcToExecute: any, context: any, thingId: string) => {
        setShowDeleteModal(undefined)
        setShowNotification(enumNotification.LOADING)
        try {
            funcToExecute(context, thingId).then(() => {
                console.log("OK")
                setShowNotification(enumNotification.SUCCESS)
            }).catch(() => {
                console.log("error")
                setShowNotification(enumNotification.ERROR)
            })
        } catch (e) {
            console.log("error")
            setShowNotification(enumNotification.ERROR)
        }

    }

    const notification = () => {
        if (showDeleteModal !== undefined) {
            const thingId = showDeleteModal
            if (!isType && funcDeleteChildren !== undefined) {
                return <ConfirmModal isOpen={true} title={messageDelete} body={descriptionDelete + `${thingId}?`} description={descriptionDeleteChildren} confirmationText={thingId} confirmText={"With children"} alternativeText={"Without children"} dismissText={"Cancel"} onAlternative={() => deleteThing(funcDelete, context, thingId)} onDismiss={() => hideNotification(false)} onConfirm={() => deleteThing(funcDeleteChildren, context, thingId)} />
            } else {
                return <ConfirmModal isOpen={true} title={messageDelete} body={descriptionDelete + `${thingId}?`} confirmText={"Delete"} onConfirm={() => deleteThing(funcDelete, context, thingId)} onDismiss={() => hideNotification(false)} />
            }
        }
        switch (showNotification) {
            case enumNotification.SUCCESS:
                return <Modal title={messageSuccess} icon='check' isOpen={true} onDismiss={() => hideNotification(true)} />
            case enumNotification.ERROR:
                return <Modal title={messageError} icon='exclamation-triangle' isOpen={true} onDismiss={() => hideNotification(false)}>{descriptionError}</Modal>
            case enumNotification.LOADING:
                return (
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                        <Spinner size={30} />
                    </div>
                )
            default:
                return <div></div>
        }
    }

    const handleOnDelete = (e: any, thingId: string) => {
        e.preventDefault()
        setShowDeleteModal(thingId)
    }

    return <Fragment>
        {notification()}
            <a href={path + '&mode=edit&element=' + title + '&id=' + thingId} style={{ all: 'unset', marginRight: "10px"}} >
                <Button icon="pen" tooltip="Edit" variant="secondary" hidden={!isEditor(userRole)}>Edit</Button>
            </a>
            <Button icon="trash-alt"  tooltip="Delete" variant="destructive" hidden={!isEditor(userRole)} onClick={(e) => handleOnDelete(e, thingId)}>Delete</Button>
    </Fragment>
}
