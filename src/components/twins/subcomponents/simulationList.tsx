import { AppEvents, AppPluginMeta, KeyValue } from '@grafana/data'
import { getAppEvents } from '@grafana/runtime'
import { Button, Card, Checkbox, Field, FieldSet, FileUpload, Form, FormAPI, Input, InputControl, LinkButton, List, Spinner, useTheme2 } from '@grafana/ui'
import React, { Fragment, useState, useContext, useEffect, ChangeEvent } from 'react'
import { duplicateTwinService } from 'services/twins/duplicateTwinService'
import { deleteSimulationService } from 'services/twins/simulation/deleteSimulationService'
import { sendSimulationRequest } from 'services/twins/simulation/sendSimulationRequestService'
import { defaultIfNoExist, enumNotification, removeEmptyEntries } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import { TypesOfField } from 'utils/data/consts'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { SimulationAttributes, SimulationContent } from 'utils/interfaces/simulation'

interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
    id: string
    twinInfo: IDittoThing
}

export const SimulationList = ({ path, meta, id, twinInfo }: Parameters) => {

    const appEvents = getAppEvents()

    const [selectedSimulation, setselectedSimulation] = useState<SimulationAttributes | undefined>()
    const [simulations, setSimulations] = useState<SimulationAttributes[]>([])
    const [thingIdSimulated, setthingIdSimulated] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [duplicateTwin, setDuplicateTwin] = useState<boolean>(false)
    const [otherValues, setOtherValues] = useState<{ [id: string]: any }>({})

    const simulationOfAttribute = {
        attributes: {
            simulationOf: id
        }
    }

    const context = useContext(StaticContext)

    const sendSimulation = async (data: any) => {
        if (selectedSimulation !== undefined) {
            sendSimulationRequest(selectedSimulation, data).then(() => {
                console.log("OK simulacion")
                appEvents.publish({
                    type: AppEvents.alertSuccess.name,
                    payload: ["Simulation request successfully submitted"]
                });

            }).catch(() => {
                console.log("error simulacion")
                appEvents.publish({
                    type: AppEvents.alertError.name,
                    payload: ["Error when calling the simulation. Please check the data you have entered."]
                });
            })
        }
    }

    const handleOnSubmit = (data: any) => {
        if (Object.keys(otherValues).length > 0) {
            data = {
                ...data,
                ...otherValues
            }
        }
        console.log(data)
        setShowNotification(enumNotification.LOADING)
        if (duplicateTwin && data.thingId) {
            const thingIds = data.thingId
            delete data.thingId
            if (selectedSimulation !== undefined) {
                data = removeEmptyEntries(data)
                let ps: Array<Promise<any>> = thingIds.split(",").map((newId: string) => duplicateTwinService(context, id, newId.trim(), simulationOfAttribute))
                Promise.all(ps).then(() => {
                    appEvents.publish({
                        type: AppEvents.alertSuccess.name,
                        payload: ["Simulated digital twins successfully created"]
                    });
                    sendSimulation(data)
                }).catch(() => {
                    appEvents.publish({
                        type: AppEvents.alertError.name,
                        payload: ["Error when duplicating digital twin"]
                    });
                }).finally(() => {
                    setShowNotification(enumNotification.HIDE)
                })
            }
        } else {
            delete data.thingId
            data = removeEmptyEntries(data)
            sendSimulation(data).finally(() => {
                setShowNotification(enumNotification.HIDE)
            })
        }

    }

    const handleOnClick = (item: SimulationAttributes) => {
        setselectedSimulation((selectedSimulation?.id === item.id) ? undefined : item)
    }

    const handleOnCLickDelete = () => {
        if (selectedSimulation) {
            deleteSimulationService(context, id, selectedSimulation.id)
            setselectedSimulation(undefined)
        }
    }

    const onChangeThingIdSimulated = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        if (newValue !== id) { setthingIdSimulated(newValue) }
    }

    const simulationsToArray = (object: { [id: string]: SimulationAttributes }) => {
        return Object.entries(object).map(([key, value]) => {
            return value
        })
    }

    const getAndSetSimulations = () => {
        setSimulations(simulationsToArray(defaultIfNoExist(twinInfo.attributes, "_simulations", {}))
            .map((item: SimulationAttributes) => {
                if (item.content) {
                    item.content = item.content.sort((a: SimulationContent, b: SimulationContent) =>
                        (a.required === b.required) ? 0 : a.required ? -1 : 1)
                }
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

    const loadingSpinner = () => {
        return (showNotification === enumNotification.LOADING) ? <Spinner size={30} /> : <div></div>
    }

    const ElementSimulation = (item: SimulationAttributes) => {
        return (
            <Card isSelected={item.id === selectedSimulation?.id} onClick={() => handleOnClick(item)}>
                <Card.Heading>{item.id}</Card.Heading>
                <Card.Description>{item.description}</Card.Description>
                <Card.Meta>
                    {[item.method, item.contentType, item.url]}
                </Card.Meta>
            </Card>
        )
    }

    const fieldSet = (register: any, control: any) => {
        if (selectedSimulation?.content !== undefined) {

            return selectedSimulation.content.map((item: SimulationContent) => {
                if (item.type === TypesOfField.FILE) {
                    return (
                        <Field label={item.name} description={item.type} required={item.required}>
                            <InputControl
                                render={({ field }) =>
                                    <FileUpload {...field}
                                        onFileUpload={({ currentTarget }) => {
                                            console.log('file', currentTarget?.files && currentTarget.files[0])
                                            if (currentTarget.files) {
                                                setOtherValues({
                                                    ...otherValues,
                                                    [item.name]: currentTarget.files[0]
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
                    return (
                        <Field label={item.name} description={item.type} required={item.required}>
                            <Input {...register(item.name, { required: item.required })}
                                type={(item.type === TypesOfField.NUMBER) ? "number" : "text"}
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

    const idSimulatedTwinForm = (register: any) => {
        return (!duplicateTwin) ? <div></div> :
            <Fragment>
                <p>Id for simulated twin</p>
                <Field label="ThingId" required={duplicateTwin} disabled={!duplicateTwin}>
                    <Input {...register("thingId", { required: duplicateTwin })} disabled={!duplicateTwin} type="text" value={thingIdSimulated} onChange={onChangeThingIdSimulated} />
                </Field>
                <hr />
            </Fragment>
    }

    const getForm = () => {
        if (selectedSimulation !== undefined) {
            return (
                <Fragment>
                    <h5>Request simulation</h5>
                    <div className="p-4" style={{ backgroundColor: useTheme2().colors.background.secondary }}>
                        <h6 className="mb-3">Simulation with id {selectedSimulation.id}</h6>
                        <Form id="formSend" onSubmit={handleOnSubmit} maxWidth="none">
                            {({ register, errors, control }: FormAPI<any>) => {
                                return (
                                    <Fragment>
                                        <Checkbox
                                            value={duplicateTwin}
                                            onChange={() => setDuplicateTwin(!duplicateTwin)}
                                            label="Duplicate twin before executing the request"
                                            description="Activate in case the simulation requires a twin identical to the current twin but with a different identifier."
                                        />
                                        <hr />
                                        {idSimulatedTwinForm(register)}
                                        {(selectedSimulation?.content !== undefined && selectedSimulation.content.length > 0) ? <p>Settings</p> : <div></div>}
                                        <FieldSet>
                                            {fieldSet(register, control)}
                                        </FieldSet>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {loadingSpinner()}
                                            <Button type="submit" icon="play" variant="primary" form="formSend" disabled={showNotification !== enumNotification.HIDE}>Simulate</Button>
                                        </div>
                                    </Fragment>
                                )
                            }}
                        </Form>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-start' }} className="mt-3">
                        <LinkButton
                            icon="pen"
                            variant="secondary"
                            href={path + '&id=' + id + '&mode=edit' + "&element=simulation&simulationId=" + selectedSimulation.id}
                            className="m-3"
                            disabled={showNotification !== enumNotification.HIDE}
                        >Edit</LinkButton>
                        <Button type="button" variant="destructive" icon="trash-alt" disabled={showNotification !== enumNotification.HIDE} className="mt-3" onClick={handleOnCLickDelete}>Delete</Button>
                    </div>
                </Fragment>
            )
        } else {
            return <div></div>
        }
    }

    const buttonAdd = <LinkButton icon="plus" variant="primary" href={path + '&mode=create&id=' + id + "&element=simulation"}>
        Add simulation
    </LinkButton>

    const noSimulations =
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5>This twin has no simulations</h5>
            {buttonAdd}
        </div>

    const twinSimulated =
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5>This twin has been created from a simulation. Access the original twin to perform simulations.</h5>
            {(twinInfo.attributes !== undefined && twinInfo.attributes.hasOwnProperty("simulationOf")) ? 
                <LinkButton icon="external-link-alt" variant="primary" href={path + '&mode=check&id=' + twinInfo.attributes.simulationOf + "&element=simulation"}>
                Go to {twinInfo.attributes.simulationOf}
            </LinkButton> : <div></div>
            }
        </div>

    const simulationsList = <Fragment>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            {buttonAdd}
        </div>
        <div className="row mt-4">
            <div className="col-12 col-md-6">
                <h5>Simulations available</h5>
                <List
                    items={simulations}
                    getItemKey={(item: SimulationAttributes) => (item.id)}
                    renderItem={(item: SimulationAttributes, index: number) => ElementSimulation(item)}
                />
            </div>
            <div className="col-12 col-md-6">
                {(selectedSimulation !== undefined) ? getForm() : <div></div>}
            </div>
        </div>
    </Fragment>

    const twinNoSimulated = (simulations.length > 0) ? simulationsList : noSimulations

    return (twinInfo.hasOwnProperty("attributes") && twinInfo.attributes.hasOwnProperty("simulationOf")) ? twinSimulated : twinNoSimulated
}
