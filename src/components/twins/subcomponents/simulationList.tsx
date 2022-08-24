import { AppPluginMeta, KeyValue } from '@grafana/data'
import { Button, Card, Field, FieldSet, Form, FormAPI, HorizontalGroup, Input, LinkButton, List, useTheme2, VerticalGroup } from '@grafana/ui'
import React, { Fragment, useState, useEffect } from 'react'
import { defaultIfNoExist } from 'utils/auxFunctions/general'
import { TypesContent } from 'utils/data/consts'
import { simulationAttributes, simulationContent } from 'utils/interfaces/simulation'

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
    id : string
    twinInfo : any
}

export const SimulationList = ({path, meta, id, twinInfo} : parameters) => {

    const [selectedSimulation, setselectedSimulation] = useState<simulationAttributes | undefined>()
    const [simulations, setSimulations] = useState<simulationAttributes[]>([])

    const handleOnSubmit = (data:any) => {
        console.log(data)
    }

    const handleOnClick = (item:simulationAttributes) => {
        console.log("CLICK")
        setselectedSimulation((selectedSimulation?.id === item.id) ? undefined : item)
    }

    const simulationsToArray = (object:{[id:string] : simulationAttributes}) => {
        return Object.entries(object).map(([key, value]) => {
            return value
        })
    }

    const getPlaceHolderByType = (type:string) => {
        switch(type){
            case TypesContent.TEXT:
                return "example"
            case TypesContent.NUMBER:
                return "0"
            case TypesContent.BOOLEAN:
                return "example"
            case TypesContent.ARRAY_TEXT:
                return "text, example, hello"
            case TypesContent.ARRAY_NUMBER:
                return "3, 4, 2, 1, 9"
            case TypesContent.ARRAY_BOOLEAN:
                return "true, false, false, true"
            default:
                return ""
        }
    }

    useEffect(() => {
    }, [selectedSimulation])

    useEffect(() => {
        setSimulations(simulationsToArray(defaultIfNoExist(twinInfo.attributes, "_simulations", {})))
    }, [twinInfo])

    useEffect(() => {
        setSimulations(simulationsToArray(defaultIfNoExist(twinInfo.attributes, "_simulations", {})))
    }, [])

    const ElementSimulation = (item:simulationAttributes) => {
        return (
            <Card heading={item.id} description={item.description} isSelected={item.id === selectedSimulation?.id} onClick={() => handleOnClick(item)}>
                <Card.Meta>
                    {[item.method, item.contentType, item.url]}
                </Card.Meta>
            </Card>
        )
    }

    const fieldSet = (register:any) => {
        if(selectedSimulation?.content !== undefined){
            return selectedSimulation.content.map((item:simulationContent) => {
                return(
                    <Field label={item.name} description={item.type} required={item.required}>
                        <Input {...register(item.name, {required : item.required})} 
                            type={(item.type == TypesContent.NUMBER) ? "number" : "text"} 
                            placeholder={getPlaceHolderByType(item.type)}
                        />
                    </Field>
                )
            })
        } else {
            return <div></div>
        }
    }


    const getForm = () => {
        if (selectedSimulation !== undefined) {
            return (
            <Fragment>
                <h5>Request simulation</h5>
                <div className="p-4" style={{backgroundColor:useTheme2().colors.background.secondary}}>
                    <h6>Simulation with id {selectedSimulation.id}</h6>
                    <Form id="formSend" onSubmit={handleOnSubmit} maxWidth="none">
                        {({register, errors}:FormAPI<any>) => {
                            return (
                                <Fragment>
                                    <FieldSet>
                                        {fieldSet(register)}
                                    </FieldSet>
                                    <VerticalGroup align="center">
                                        <Button type="submit" variant="primary" form="formSend">Simulate</Button>
                                    </VerticalGroup>
                                </Fragment>
                            )
                        }}
                    </Form>
                </div>
            </Fragment>
            )
        } else {
            return <div></div>
        }
    }

    return (
        <Fragment>
            <HorizontalGroup justify="center">
                    <LinkButton variant="primary" href={path + '&mode=create' + ((id !== undefined) ? '&id='+ id : "")} className="m-3">
                        Add simulation
                    </LinkButton>
                </HorizontalGroup>
            <div className="row mt-4">
                <div className="col-6">
                    <h5>Simulations available</h5>
                    <List
                        items={simulations}
                        getItemKey={(item:simulationAttributes) => (item.id)}
                        renderItem={(item:simulationAttributes, index:number) => ElementSimulation(item)}
                    />
                </div>
                <div className="col-6">
                    {(selectedSimulation !== undefined) ? getForm() : <div></div>}
                </div>
            </div>
        </Fragment>
    )
}