import { Button, ConfirmModal, Modal, Spinner } from "@grafana/ui"
import React, { useState, Fragment, useEffect } from "react"
// 1. Importamos el hook de historial
import { useHistory } from "react-router-dom"
import { getCurrentUserRole, isEditor, Roles } from "utils/auxFunctions/auth"
import { enumNotification } from "utils/auxFunctions/general"

interface Parameters {
    path: string       // Esperamos la ruta base del recurso (ej: /a/plugin/twins)
    thingId: string
    isType: boolean
    funcDelete: (id: string) => Promise<any>
    funcDeleteChildren?: (id: string) => Promise<any>
}

export const ButtonsInfo = ({ path, thingId, isType, funcDelete, funcDeleteChildren }: Parameters) => {
    const history = useHistory();
    
    const title = (isType) ? "type" : "twin"
    const messageDelete = `Delete ${title}`
    const descriptionDelete = `Are you sure you want to remove the ${title} with id `
    const descriptionDeleteChildren = "Choose if you want to remove the twin alone, unlinking its children, or remove the twin and all its children."
    const messageSuccess = `The ${title} has been deleted correctly.`
    const messageError = `The ${title} has not been deleted correctly.`
    const descriptionError = "Refresh the page or check for errors."

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
            history.push(path) 
        }
    }

    const deleteThing = (funcToExecute: any, id: string) => {
        setShowDeleteModal(undefined)
        setShowNotification(enumNotification.LOADING)
        try {
            funcToExecute(id).then(() => {
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
            const idToDelete = showDeleteModal
            if (!isType && funcDeleteChildren !== undefined) {
                return (
                    <ConfirmModal 
                        isOpen={true} 
                        title={messageDelete} 
                        body={descriptionDelete + `${idToDelete}?`} 
                        description={descriptionDeleteChildren} 
                        confirmationText={idToDelete} 
                        confirmText={"With children"} 
                        alternativeText={"Without children"} 
                        dismissText={"Cancel"} 
                        onAlternative={() => deleteThing(funcDelete, idToDelete)} 
                        onDismiss={() => hideNotification(false)} 
                        onConfirm={() => deleteThing(funcDeleteChildren, idToDelete)} 
                    />
                )
            } else {
                return (
                    <ConfirmModal 
                        isOpen={true} 
                        title={messageDelete} 
                        body={descriptionDelete + `${idToDelete}?`} 
                        confirmText={"Delete"} 
                        onConfirm={() => deleteThing(funcDelete, idToDelete)} 
                        onDismiss={() => hideNotification(false)} 
                    />
                )
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
                return null
        }
    }

    const handleOnDelete = (e: any) => {
        e.preventDefault()
        setShowDeleteModal(thingId)
    }

    // 3. NAVEGACIÓN EDICIÓN
    const handleOnEdit = () => {
        // Ruta: /a/plugin/twins/123/edit
        history.push(`${path}/${thingId}/edit`);
    }

    // Si no es editor, no mostramos nada (o podrías retornar null)
    if (!isEditor(userRole)) {
        return null; 
    }

    return (
        <Fragment>
            {notification()}
            
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* 4. BOTÓN EDITAR */}
                <Button 
                    icon="pen" 
                    tooltip="Edit" 
                    variant="secondary" 
                    onClick={handleOnEdit}
                >
                    Edit
                </Button>

                {/* 5. BOTÓN ELIMINAR */}
                <Button 
                    icon="trash-alt" 
                    tooltip="Delete" 
                    variant="destructive" 
                    onClick={handleOnDelete}
                >
                    Delete
                </Button>
            </div>
        </Fragment>
    )
}
