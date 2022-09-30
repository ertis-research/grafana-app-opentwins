import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Button, Card, Checkbox, Field, FieldSet, FileUpload, Form, FormAPI, HorizontalGroup, Input, InputControl, LinkButton, List, Modal, Spinner, useTheme2, VerticalGroup } from '@grafana/ui'
import React, { Fragment, useState, useContext, useEffect, ChangeEvent } from 'react'
import { duplicateTwinService } from 'services/twins/duplicateTwinService'
import { deleteSimulationService } from 'services/twins/simulation/deleteSimulationService'
import { sendSimulationRequest } from 'services/twins/simulation/sendSimulationRequestService'
import { defaultIfNoExist, enumNotification, removeEmptyEntries } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import { getPlaceHolderByType, TypesOfField } from 'utils/data/consts'
import { ISimulationAttributes, ISimulationContent } from 'utils/interfaces/simulation'

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
    id : string
    twinInfo : any
}

export const SimulationList = ({path, meta, id, twinInfo} : parameters) => {

    const [selectedSimulation, setselectedSimulation] = useState<ISimulationAttributes | undefined>()
    const [simulations, setSimulations] = useState<ISimulationAttributes[]>([])
    const [thingIdSimulated, setthingIdSimulated] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [duplicateTwin, setDuplicateTwin] = useState<boolean>(false)
    const [otherValues, setOtherValues] = useState<{[id:string] : any}>({})

    const messageSuccess = `Simulated twin successfully created and simulation request sent.`
    const descriptionSuccess = `aa`
    const messageError = `Error`
    const descriptionError = "Please check the data you have entered."

    const simulationOfAttribute = {
        attributes: {
            simulationOf: id
        }
    }

    const context = useContext(StaticContext)

    const sendSimulation = (data:any) => {
        if(selectedSimulation !== undefined){
            sendSimulationRequest(selectedSimulation, data).then(() => {
                console.log("OK simulacion")
                setShowNotification(enumNotification.SUCCESS)
                
            }).catch(() => {
                console.log("error simulacion")
                setShowNotification(enumNotification.ERROR)
            })
        }
    }

    const handleOnSubmit = (data:any) => {
        if(Object.keys(otherValues).length > 0){
            data = {
                ...data,
                ...otherValues
            }
        }
        console.log(data)
        setShowNotification(enumNotification.LOADING)
        if(duplicateTwin && data.thingId) {
            const thingIds = data.thingId
            delete data.thingId
            if(selectedSimulation !== undefined){
                data = removeEmptyEntries(data)
                var ps:Promise<any>[] = thingIds.split(",").map((newId:string) => duplicateTwinService(context, id, newId.trim(), simulationOfAttribute))
                Promise.all(ps).then(() => {
                    console.log("OK duplicar")
                    sendSimulation(data)
                }).catch(() => {
                    console.log("error duplicar")
                    setShowNotification(enumNotification.ERROR)
                })
            }
        } else {
            delete data.thingId
            data = removeEmptyEntries(data)
            sendSimulation(data)
        }
        
    }

    const handleOnClick = (item:ISimulationAttributes) => {
        setselectedSimulation((selectedSimulation?.id === item.id) ? undefined : item)
    }

    const handleOnCLickDelete = () => {
        if(selectedSimulation){
            deleteSimulationService(context, id, selectedSimulation.id)
            setselectedSimulation(undefined)
        }
    }

    const onChangeThingIdSimulated = (event:ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        if(newValue != id) setthingIdSimulated(newValue)
    }

    const simulationsToArray = (object:{[id:string] : ISimulationAttributes}) => {
        return Object.entries(object).map(([key, value]) => {
            return value
        })
    }

    const hideNotification = () => {
        setShowNotification(enumNotification.HIDE)
    }

    const getAndSetSimulations = () => {
        setSimulations(simulationsToArray(defaultIfNoExist(twinInfo.attributes, "_simulations", {}))
            .map((item:ISimulationAttributes) => {
                if(item.content) item.content = item.content.sort((a:ISimulationContent, b:ISimulationContent) => 
                    (a.required === b.required) ? 0 : a.required? -1 : 1)
                return item
        }))
    }

    useEffect(() => {
    }, [selectedSimulation])

    useEffect(() => {
    }, [showNotification])

    useEffect(() => {
        getAndSetSimulations()
    }, [twinInfo])

    useEffect(() => {
        getAndSetSimulations()
    }, [])

    const notification = () => {
        switch(showNotification) {
            case enumNotification.SUCCESS:
                return <Modal title={messageSuccess} icon='check-circle' isOpen={true} onDismiss={() => hideNotification()}>{descriptionSuccess}</Modal>
                //return <Alert title={messageSuccess} severity={"success"} elevated />
            case enumNotification.ERROR:
                return <Modal title={messageError} icon='exclamation-triangle' isOpen={true} onDismiss={() => hideNotification()}>{descriptionError}</Modal>
            default:
                return <div></div>
        }
    }

    const loadingSpinner = () => {
        return (showNotification === enumNotification.LOADING) ? <Spinner size={30}/> : <div></div>
    }

    const ElementSimulation = (item:ISimulationAttributes) => {
        return (
            <Card heading={item.id} description={item.description} isSelected={item.id === selectedSimulation?.id} onClick={() => handleOnClick(item)}>
                <Card.Meta>
                    {[item.method, item.contentType, item.url]}
                </Card.Meta>
            </Card>
        )
    }

    const fieldSet = (register:any, control:any) => {
        if(selectedSimulation?.content !== undefined){

            return selectedSimulation.content.map((item:ISimulationContent) => {
                if(item.type == TypesOfField.FILE){
                    return(
                        <Field label={item.name} description={item.type} required={item.required}>
                            <InputControl
                                render={({field}) => 
                                <FileUpload {...field} 
                                    onFileUpload={({ currentTarget }) => {
                                        console.log('file', currentTarget?.files && currentTarget.files[0])
                                        if(currentTarget.files){
                                            setOtherValues({
                                                ...otherValues,
                                                [item.name] : currentTarget.files[0]
                                            })
                                        }
                                    }}
                                />
                                }
                                control={control}
                                name={`${item.name}` as const}
                            />
                        </Field>
                    )
                } else {
                    return(
                        <Field label={item.name} description={item.type} required={item.required}>
                            <Input {...register(item.name, {required : item.required})} 
                                type={(item.type == TypesOfField.NUMBER) ? "number" : "text"} 
                                placeholder={getPlaceHolderByType(item.type)}
                                defaultValue={item.default}
                            />
                        </Field>
                    )
                }
                
            })
        } else {
            return <div></div>
        }
    }     

    const idSimulatedTwinForm = (register:any) => {
        return (!duplicateTwin) ? <div></div> : 
        <Fragment>
            <p>Id for simulated twin</p>
            <Field label="ThingId" required={duplicateTwin} disabled={!duplicateTwin}>
                <Input {...register("thingId", {required : duplicateTwin})} disabled={!duplicateTwin} type="text" value={thingIdSimulated} onChange={onChangeThingIdSimulated}/>
            </Field>
            <hr/>
        </Fragment>}

    const getForm = () => {
        if (selectedSimulation !== undefined) {
            return (
            <Fragment>
                <h5>Request simulation</h5>
                <div className="p-4" style={{backgroundColor:useTheme2().colors.background.secondary}}>
                    <h6 className="mb-3">Simulation with id {selectedSimulation.id}</h6>
                    <Form id="formSend" onSubmit={handleOnSubmit} maxWidth="none">
                        {({register, errors, control}:FormAPI<any>) => {
                            return (
                                <Fragment>
                                    <Checkbox
                                        value={duplicateTwin}
                                        onChange={() => setDuplicateTwin(!duplicateTwin)}
                                        label="Duplicate twin before executing the request"
                                        description="Activate in case the simulation requires a twin identical to the current twin but with a different identifier."
                                    />
                                    <hr/>
                                    {idSimulatedTwinForm(register)}
                                    {(selectedSimulation?.content !== undefined && selectedSimulation.content.length > 0) ? <p>Settings</p> : <div></div>}
                                    <FieldSet>
                                        {fieldSet(register, control)}
                                    </FieldSet>
                                    <VerticalGroup align="center">
                                        {loadingSpinner()}
                                        <Button type="submit" icon="play" variant="primary" form="formSend" disabled={showNotification != enumNotification.HIDE}>Simulate</Button>
                                    </VerticalGroup>
                                </Fragment>
                            )
                        }}
                    </Form>
                </div>
                <HorizontalGroup justify="flex-end" align="flex-start" className="mt-3">
                    <LinkButton 
                        icon="pen"
                        variant="secondary" 
                        href={path + '&id=' + id +'&mode=edit' + "&element=simulation&simulationId=" + selectedSimulation.id} 
                        className="m-3"
                        disabled={showNotification != enumNotification.HIDE}
                    >Edit</LinkButton>
                    <Button type="button" variant="destructive" icon="trash-alt" disabled={showNotification != enumNotification.HIDE} className="mt-3" onClick={handleOnCLickDelete}>Delete</Button>
                </HorizontalGroup>
            </Fragment>
            )
        } else {
            return <div></div>
        }
    }

    const noSimulations = 
        <VerticalGroup align="center">
            <h5>This twin has no simulations</h5>
        </VerticalGroup>

    const twinSimulated = 
        <VerticalGroup align="center">
            <h5>This twin has been created from a simulation. Access the original twin to perform simulations.</h5>
            <LinkButton icon="external-link-alt" variant="primary" href={path + '&mode=check&id=' + twinInfo.attributes.simulationOf + "&element=simulation"}>
                Go to {twinInfo.attributes.simulationOf}
            </LinkButton>
        </VerticalGroup>

    const simulationsList = 
        <div className="row mt-4">
            <div className="col-12 col-md-6">
            <h5>Simulations available</h5>
            <List
                items={simulations}
                getItemKey={(item:ISimulationAttributes) => (item.id)}
                renderItem={(item:ISimulationAttributes, index:number) => ElementSimulation(item)}
            />
            </div>
            <div className="col-12 col-md-6">
                {(selectedSimulation !== undefined) ? getForm() : <div></div>}
            </div>
        </div>

    const twinNoSimulated =
        <Fragment>
            {notification()}
            <HorizontalGroup justify="center">
                <LinkButton icon="plus" variant="primary" href={path + '&mode=create&id=' + id + "&element=simulation"} className="m-3">
                    Add simulation
                </LinkButton>
            </HorizontalGroup>
            {(simulations.length > 0) ? simulationsList : noSimulations}
        </Fragment>

    return (twinInfo.attributes && twinInfo.attributes.simulationOf) ? twinSimulated : twinNoSimulated
}