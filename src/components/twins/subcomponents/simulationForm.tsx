import React, { Fragment, useState, useContext, useEffect, ChangeEvent } from 'react'
import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { Button, ConfirmModal, Field, FieldSet, Form, FormAPI, Input, InputControl, List, Modal, Select, Switch, TextArea, useTheme2 } from '@grafana/ui'
import { ElementHeader } from 'components/auxiliary/general/elementHeader'
import { ListElement } from 'components/auxiliary/general/listElement'
import { enumNotification, enumToISelectList } from 'utils/auxFunctions/general'
import { ContentType, MethodRequest, TypesOfField} from 'utils/data/consts'
import { ISelect } from 'utils/interfaces/select'
import { Control } from 'react-hook-form'
import { ISimulationAttributes, ISimulationAttributesForm, ISimulationContent } from 'utils/interfaces/simulation'
import { StaticContext } from 'utils/context/staticContext'
import { createOrUpdateSimulationService } from 'services/twins/simulation/createOrUpdateSimulationService'
import { getSimulationService } from 'services/twins/simulation/getSimulationService'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    id: string
    simulationId?: string
}

export const SimulationForm = ({path, meta, id, simulationId}: Parameters) => {

    const editMode = simulationId !== undefined
    const iniMethod = MethodRequest.GET

    const [method, setMethod] = useState<SelectableValue<MethodRequest>>()
    const [contentType, setContentType] = useState<SelectableValue<ContentType>>()
    const [typeOfField, setTypeOfField] = useState<SelectableValue<TypesOfField>>()
    const [hasContent, setHasContent] = useState<boolean>(false)
    const [content, setContent] = useState<ISimulationContent[]>([])
    const [actualSimulation, setActualSimulation] = useState<ISimulationAttributes>({id:"", url: "", method: iniMethod})
    const [showNotification, setShowNotification] = useState(enumNotification.HIDE)

    const methodList: ISelect[] = enumToISelectList(MethodRequest)
    const contentTypeList: ISelect[] = enumToISelectList(ContentType)
    const typesOfFieldList: ISelect[] = enumToISelectList(TypesOfField)

    const context = useContext(StaticContext)

    const contentDescription = "If the simulation needs to receive parameters, then configure the fields to be sent in the body of the request below"
    const titleSuccessEdit = "Successful edition!"
    const titleSuccessCreate = "Successful creation!"
    const descriptionSuccessEdit = "You can re-edit the simulation or leave the page."
    const descriptionSuccessCreate = "You can delete the fields to create a new simulation, keep them if you want to create a similar one or leave the page if you don't want to create any more."
    const titleError = "The simulation has not been created correctly. "
    const descriptionError = "Please check the data you have entered and try again."

    const handleOnSubmit = (data: ISimulationAttributesForm) => {
        console.log("HOLA")
        setShowNotification(enumNotification.LOADING)
        console.log("HOLA2")
        createOrUpdateSimulationService(context, id, actualSimulation).then(() => {
            console.log("creado")
            setShowNotification(enumNotification.SUCCESS)
        }).catch(() => {
            setShowNotification(enumNotification.ERROR)
        })
    }

    const handleOnChangeInputAttribute = (event: ChangeEvent<HTMLInputElement>) => {
        setActualSimulation({
            ...actualSimulation,
            [event.currentTarget.name] : event.target.value
        })
      }

    const handleSubmitContent = (data: ISimulationContent) => {
        if(typeOfField?.value) {
            data = {
                ...data,
                type: typeOfField.value
            }
        }
        if (data.default === "") {delete data.default} 

        let found = false
        const newContent = content.map((item: ISimulationContent) => {
            if(item.name === data.name){
                found = true
                return data
            }
            return item
        })
        if(found) {
            setContent(newContent)
        } else {
            setContent([
                ...content,
                data
            ])
        }
    }

    const notification = () => {
        switch(showNotification) {
            case enumNotification.SUCCESS:
                if (editMode) {
                    return <Modal isOpen={true} icon='check' title={titleSuccessEdit} onDismiss={() => hideNotification(false)}>{descriptionSuccessEdit}</Modal>
                } else {
                    return <ConfirmModal isOpen={true} icon='check' title={titleSuccessCreate} body={descriptionSuccessCreate} confirmText={"Clear fields"} dismissText={"Keep fields"} onConfirm={clearFields} onDismiss={hideNotification} />
                }
            case enumNotification.ERROR:
                return <Modal title={titleError} icon='exclamation-triangle' isOpen={true} onDismiss={() => hideNotification(false)}>{descriptionError}</Modal>
            default:
                return <div></div>
        }
    }

    const clearFields = () => {
        setMethod({label: iniMethod, value: iniMethod})
        setContent([])
        setHasContent(false)
        setContentType(undefined)
        setTypeOfField(undefined)
        setActualSimulation({id:"", url: "", method: iniMethod})
    }

    const hideNotification = (removeId = true) => {
        if(removeId){
            setActualSimulation({
                ...actualSimulation,
                id : ""
            })
        }
        setShowNotification(enumNotification.HIDE)
    }

    useEffect(() => {
        if (hasContent) {
            let jsonContent: ISimulationContent[] = []
            content.forEach((item: ISimulationContent) => jsonContent.push(item));
    
            setActualSimulation({
                ...actualSimulation,
                content : jsonContent
            })
        } else {
            setActualSimulation({
                ...actualSimulation,
                content : undefined,
                contentType : undefined
            })
        }
        
    }, [content, hasContent])
    

    useEffect(() => {
        if(hasContent && contentType?.value){
            setActualSimulation({
                ...actualSimulation,
                contentType: contentType.value
            })
        }
    }, [contentType])

    useEffect(() => {
        if(method?.value){
            setActualSimulation({
                ...actualSimulation,
                method: method.value
            })
        }
    }, [method])

    useEffect(() => {
        if(simulationId !== undefined) {
            getSimulationService(context, id, simulationId).then((simulation: ISimulationAttributes) => {
                setActualSimulation(simulation)
                setMethod({label: simulation.method, value: simulation.method})
                if (simulation.contentType) {setContentType({label: simulation.contentType, value: simulation.contentType})}
                if (simulation.content) {
                    setHasContent(true)
                    setContent(simulation.content)
                }
            })
        }
    }, [simulationId])
    
    useEffect(() => {
    }, [actualSimulation, showNotification])

    const contentTypeField = (control: Control<ISimulationAttributesForm>) => {
        return (!hasContent) ? <div></div> : 
        <Fragment>
            <Field label="Content-type" required={hasContent}>
                <InputControl
                    render={({field}) => 
                    <Select {...field}
                        options={contentTypeList}
                        value={contentType}
                        onChange={(v) => { setContentType(v); }}
                    />
                    }
                    control={control}
                    name="contentType"
                />
            </Field>
        </Fragment>
    }

    const contentForm = () => {
        return (!hasContent) ? <div></div> : 
        <Fragment>
            <hr/>
            <ElementHeader title="Content of the request" description={contentDescription} isLegend={false}/>
            <div className="row">
                <div className="col-6">
                    <Form id="formContent" onSubmit={handleSubmitContent} maxWidth="none">
                    {({register, errors, control}: FormAPI<ISimulationContent>) => {
                        return (
                            <Fragment>
                                <FieldSet>
                                    <Field label="Name" required={true}>
                                        <Input {...register("name", { required : true })} type="text"/>
                                    </Field>
                                    <Field label="Type of field" required={true}>
                                    <InputControl
                                        render={({field}) => 
                                            <Select {...field}
                                                options={typesOfFieldList}
                                                value={typeOfField}
                                                onChange={(v) => { setTypeOfField(v); }}
                                                disabled={showNotification !== enumNotification.HIDE}
                                            />
                                        }
                                        control={control}
                                        name="type"
                                    />
                                    </Field>
                                    <Field label="Required" required={true}>
                                        <Switch {...register("required")}/>
                                    </Field>
                                    <Field label="Default value">
                                        <Input {...register("default")} type="text"/>
                                    </Field>
                                </FieldSet>
                                <Button type="submit" variant="secondary" form="formContent" disabled={showNotification !== enumNotification.HIDE}>Add</Button>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-6">
                    <List 
                        items={content}
                        getItemKey={item => (item.name)}
                        renderItem={item => ListElement(item.name, content, setContent, [{key: "name", value: item.name}], false)}
                    />
                </div>
            </div>    
        </Fragment>
    }

    return (
        <Fragment>
            {notification()}
            <h2 style={{marginBottom: '0px', paddingBottom: '0px'}}>{(editMode) ? "Edit simulation with id " + simulationId : "Create new simulation"}</h2>
            <h4 className="mb-4" style={{color:useTheme2().colors.text.secondary}}>For twin with id: {id}</h4>
            <div className="row">
                <div className="col-7">
                    <Form id="formSimulation" onSubmit={handleOnSubmit} maxWidth="none">
                    {({register, errors, control}: FormAPI<ISimulationAttributesForm>) => {
                        return (
                            <Fragment>
                                <FieldSet>
                                    <Field label="Id" required={!editMode} disabled={editMode}>
                                        <Input {...register("id", { required : !editMode })} type="text" disabled={editMode} value={actualSimulation.id} onChange={handleOnChangeInputAttribute}/>
                                    </Field>
                                    <Field label="Description">
                                        <Input {...register("description", { required : false })} type="text" value={actualSimulation.description} onChange={handleOnChangeInputAttribute}/>
                                    </Field>
                                    <Field label="URL" required={true}>
                                        <Input {...register("url", { required : true })} type="url" value={actualSimulation.url} onChange={handleOnChangeInputAttribute}/>
                                    </Field>
                                    <Field label="Method" required={true}>
                                        <InputControl
                                            render={({field}) => 
                                                <Select {...field}
                                                    options={methodList}
                                                    value={method}
                                                    defaultValue={{label: actualSimulation.method, value: actualSimulation.method}}
                                                    onChange={(v) => { setMethod(v); }}
                                                    disabled={showNotification !== enumNotification.HIDE}
                                                />
                                            }
                                            control={control}
                                            name="method"
                                        />
                                    </Field>
                                    <Field label="Has content?" required={true}>
                                        <Switch {...register("hasContent")} value={hasContent} disabled={showNotification !== enumNotification.HIDE} onChange={(e) => setHasContent(!hasContent)}/>
                                    </Field>
                                    {contentTypeField(control)}
                                </FieldSet>
                            </Fragment>
                        )
                    }}
                    </Form>
                    {contentForm()}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button type="submit" variant="primary" form="formSimulation" disabled={showNotification !== enumNotification.HIDE}>{(editMode) ? "Edit" : "Create"} simulation</Button>
                    </div>
                </div>
                <div className="col-5">
                    <Field label="Preview" style={{minHeight: '1%', marginBottom: '0px', paddingBottom: '0px'}}><div></div></Field>
                    <TextArea style={{resize: 'none', minHeight: '99%', flex: 1, overflow: "auto", boxSizing: 'border-box' }} value={JSON.stringify(actualSimulation, undefined, 4)} rows={25} readOnly/>
                </div>
            </div>
        </Fragment>
    )
}
