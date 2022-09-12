import React, { useEffect, useContext, useState, Fragment } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { StaticContext } from 'utils/context/staticContext'
import { Button, Field, FieldSet, Form, FormAPI, Input, Modal, Spinner } from '@grafana/ui'
import { duplicateTwinService } from 'services/twins/duplicateTwinService'
import { enumNotification } from 'utils/auxFunctions/general'


interface parameters {
    path : string
    id : string
    meta : AppPluginMeta<KeyValue<any>>
}

interface IDuplicateForm {
    id : string,
    namespace : string
}

export function OtherFunctionsTwin({ path, id, meta } : parameters) {

    const context = useContext(StaticContext)
    const [notificationText, setNotificationText] = useState({title: "", description: ""})
    const [showNotification, setShowNotification] = useState(enumNotification.HIDE)

    const descriptionDuplicate = "Enter the id and namespace you want the duplicate twin to have."
    const duplicateSuccess = {
        title: "Successful duplication!",
        description: "The twin has been duplicated successfully. You can access it from the main twins tab."
    }
    const duplicateError = {
        title: "Duplication error",
        description: "The twin could not be duplicated. Check the fields entered and the API connection."
    }

    const notification = () => {
        switch(showNotification) {
            case enumNotification.SUCCESS || enumNotification.ERROR:
                return <Modal title={notificationText.title} isOpen={true} onDismiss={() => setShowNotification(enumNotification.HIDE)}>{notificationText.description}</Modal>
            case enumNotification.LOADING:
                return <Spinner size={30}/> 
            default:
                return <div></div>
        }
    }

    const handleDuplicateTwin = (data:IDuplicateForm) => {
        setShowNotification(enumNotification.LOADING)
        duplicateTwinService(context, id, data.namespace + ":" + data.id).then(() => {
            setNotificationText(duplicateSuccess)
            setShowNotification(enumNotification.SUCCESS)
        }).catch(()=> {
            setNotificationText(duplicateError)
            setShowNotification(enumNotification.ERROR)
        })
    }

    useEffect(() => {
    }, [id, showNotification])

    const duplicateForm = 
    <Fragment>
            <h5>Duplicate twin</h5>
            <p>{descriptionDuplicate}</p>
            <Form id="formDuplicate" onSubmit={handleDuplicateTwin} maxWidth="none">
                {({register, errors, control}:FormAPI<IDuplicateForm>) => {
                return (
                    <FieldSet>
                        <Field label="Namespace" required={true} disabled={showNotification != enumNotification.HIDE}>
                            <Input {...register("namespace", { required : true })} type="text" disabled={showNotification != enumNotification.HIDE}/>
                        </Field>
                        <Field label="Id" required={true} disabled={showNotification != enumNotification.HIDE}>
                            <Input {...register("id", { required : true })} type="text" disabled={showNotification != enumNotification.HIDE}/>
                        </Field>
                        {notification()}
                        <Button type="submit" variant="primary" form="formDuplicate" disabled={showNotification != enumNotification.HIDE}>Duplicate</Button>
                    </FieldSet>
                )}}
            </Form>
    </Fragment>

    return (
        <Fragment>
            <div className="row">
                <div className="col-6">
                    {duplicateForm}
                </div>
            </div>
        </Fragment>
    )

}