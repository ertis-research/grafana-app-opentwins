import React, { useEffect, useContext, useState, Fragment } from 'react'
import { AppEvents, AppPluginMeta, KeyValue } from '@grafana/data'
import { StaticContext } from 'utils/context/staticContext'
import { Button, Field, FieldSet, Form, FormAPI, Input, Spinner, useTheme2 } from '@grafana/ui'
import { enumNotification } from 'utils/auxFunctions/general'
import { getAppEvents } from '@grafana/runtime'
import { duplicateTwinService } from 'services/TwinsService'


interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

interface DuplicateForm {
    id: string,
    namespace: string
}

export function OtherFunctionsTwin({ path, id, meta }: Parameters) {

    const bgcolor = useTheme2().colors.background.secondary
    const context = useContext(StaticContext)
    const appEvents = getAppEvents()

    const [showNotification, setShowNotification] = useState(enumNotification.HIDE)
    const descriptionDuplicate = "Enter the id and namespace you want the duplicate twin to have"


    const notification = () => {
        switch(showNotification) {
            case enumNotification.LOADING:
                return <Spinner size={30}/> 
            default:
                return <div></div>
        }
    }

    const handleDuplicateTwin = (data: DuplicateForm) => {
        setShowNotification(enumNotification.LOADING)
        duplicateTwinService(context, id, data.namespace + ":" + data.id).then(() => {
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: ["The twin has been duplicated successfully. You can access it from the main twins tab."]
            });
        }).catch(()=> {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["The twin could not be duplicated. Check the fields entered and the API connection."]
            });
        }).finally(() => {
            setShowNotification(enumNotification.HIDE)
        })
    }

    useEffect(() => {
    }, [id, showNotification])

    const duplicateForm = 
    <Fragment>
            <h5><b>Duplicate twin</b></h5>
            
            <hr />
            <p>{descriptionDuplicate}</p>
            <Form id="formDuplicate" onSubmit={handleDuplicateTwin} maxWidth="none">
                {({register, errors, control}: FormAPI<DuplicateForm>) => {
                return (
                    <FieldSet>
                        <Field label="Namespace" required={true} disabled={showNotification !== enumNotification.HIDE}>
                            <Input {...register("namespace", { required : true })} type="text" disabled={showNotification !== enumNotification.HIDE}/>
                        </Field>
                        <Field label="Id" required={true} disabled={showNotification !== enumNotification.HIDE}>
                            <Input {...register("id", { required : true })} type="text" disabled={showNotification !== enumNotification.HIDE}/>
                        </Field>
                        {notification()}
                        <Button type="submit" variant="primary" form="formDuplicate" disabled={showNotification !== enumNotification.HIDE}>Duplicate</Button>
                    </FieldSet>
                )}}
            </Form>
    </Fragment>

    return (
        <Fragment>
            <div className="row">
                <div className="col-0 col-md-0 col-lg-3"></div>
                <div className="col-12 col-md-12 col-lg-6">
                    <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px', height: '100%' }}>
                        {duplicateForm}
                    </div>
                </div>
                <div className="col-0 col-md-0 col-lg-3"></div>
            </div>
        </Fragment>
    )

}
