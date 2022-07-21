import React, { useState, Fragment, useEffect, useContext, ChangeEvent } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IAttribute, IDittoThing, IDittoThingData, IDittoThingForm, IFeature } from 'utils/interfaces/dittoThing'
import { Form, FormAPI, Field, Input, InputControl, Select, Icon, TextArea, Button, HorizontalGroup, RadioButtonGroup, Switch, useTheme2, Modal, ConfirmModal } from '@grafana/ui'
import { SelectableValue } from '@grafana/data/types/select'
import { ISelect } from 'utils/interfaces/select'
import { ElementHeader } from 'components/auxiliary/general/elementHeader'
import { enumOptions, options } from 'utils/data/consts'
import { Control } from 'react-hook-form'
import { FormAttributes } from 'components/types/form/subcomponents/formAttributes'
import { FormFeatures } from 'components/types/form/subcomponents/formFeatures'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { IPolicy } from 'utils/interfaces/dittoPolicy'
import { StaticContext } from 'utils/context/staticContext'
import { getSelectWithObjectsFromThingsArray, JSONtoIAttributes, JSONtoIFeatures } from 'utils/auxFunctions/dittoThing'
import { getAllTypesService } from 'services/types/getAllTypesService'
import { capitalize, enumNotification } from 'utils/auxFunctions/general'

interface parameters {
    path : string
    parentId ?: string
    isType : boolean
    meta: AppPluginMeta<KeyValue<any>>
    funcFromType ?: any
    funcFromZero : any
}

export const ThingForm = ({ path, parentId, isType, funcFromType, funcFromZero } : parameters) => {
    const [lastCurrentThing, setLastCurrentThing] = useState<IDittoThing>({ thingId: "", policyId: "", attributes: {}})
    const [currentThing, setCurrentThing] = useState<IDittoThing>(lastCurrentThing)
    const [thingIdField, setThingIdField] = useState<{ id : string, namespace : string }>({id: "", namespace: ""})
    const [type, setType] = useState<SelectableValue<IDittoThing>>()
    const [types, setTypes] = useState<ISelect[]>([])
    const [selected, setSelected] = useState(enumOptions.FROM_TYPE)
    const [customizeType, setCustomizeType] = useState(false)
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [features, setFeatures] = useState<IFeature[]>([])
    const [policies, setPolicies] = useState<ISelect[]>([])
    const [selectedPolicy, setSelectedPolicy] = useState<SelectableValue<string>>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    
    const context = useContext(StaticContext)

    const title = (isType) ? "type" : "twin"
    const descriptionID = "Identity associated with the authentication credentials"
    const descriptionInformation = "Basic information for creating the Ditto thing"
    const descriptionThingId = `Thing ID. This must be unique within the scope of the ${title}. The name of the ${title} will precede it automatically.`
    //const descriptionPassword = "Password to authenticate when sending data from the sensor to eclipse Hono."
    const descriptionNamespace = "AA"
    const messageSuccess = `The ${title} has been created correctly.`
    const descriptionSuccess = `You can delete the fields to create a new ${title}, keep them if you want to create a similar one or leave the page if you don't want to create any more.`
    const messageError = `The ${title} has not been created correctly. `
    const descriptionError = "Please check the data you have entered."

    const headerIfIsChild = () => {
        if(parentId != null){
            return <h4 style={{color:useTheme2().colors.text.secondary}}>To be child of {title} with id: {parentId}</h4>
        } else {
            return <div style={{height: '0px'}}></div>
        }
    }

    const clearFields = () => {
        setThingIdField({ id : "", namespace: ""})
        setCustomizeType(false)
        setType(undefined)
        setSelectedPolicy(undefined)
        setAttributes([])
        setFeatures([])
        setSelected(enumOptions.FROM_TYPE)
        setLastCurrentThing({ thingId: "", policyId: "", attributes: { name: "", description: "", image: "", type: ""}})
        setCurrentThing({ thingId: "", policyId: "", attributes: { name: "", description: "", image: "", type: ""}})
        setShowNotification(enumNotification.HIDE)
    }

    const hideNotification = () => {
        setThingIdField({
            ...thingIdField,
            id : ""
        })
        setShowNotification(enumNotification.HIDE)
    }

    const notification = () => {
        switch(showNotification) {
            case enumNotification.SUCCESS:
                return <ConfirmModal isOpen={true} icon='check' title={"Successful creation!"} body={messageSuccess} description={descriptionSuccess} confirmText={"Clear fields"} dismissText={"Keep fields"} onConfirm={clearFields} onDismiss={hideNotification} />
                //return <Alert title={messageSuccess} severity={"success"} elevated />
            case enumNotification.ERROR:
                return <Modal title={messageError} icon='exclamation-triangle' isOpen={true}>{descriptionError}</Modal>
            default:
                return <div></div>
        }
    }

    const handleOnSubmitFinal = (data:IDittoThingForm) => {
        const thingId = data.namespace + ":" + data.id
        const finalData:IDittoThingData = {
            policyId : currentThing.policyId,
            definition : currentThing.definition,
            attributes : currentThing.attributes,
            features : currentThing.features
        }
        var funcToExecute = undefined

        if(selected === enumOptions.FROM_TYPE && type?.value !== undefined){
            if(customizeType){
                funcToExecute = funcFromType(context, thingId, type.value.thingId, finalData)
            } else {
                funcToExecute = funcFromType(context, thingId, type.value.thingId)
            }
        } else {
            funcToExecute = funcFromZero(context, thingId, finalData)
        }
        
        try {
            funcToExecute.then(() => {
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

    const handleOnChangeThingId = (event:ChangeEvent<HTMLInputElement>) => {
        setThingIdField({
            ...thingIdField,
            [event.currentTarget.name] : event.target.value
        })
    }

    const handleOnChangeFrom = (value:number) => {
        setSelected(value)
        const aux = currentThing
        const auxAttributes = lastCurrentThing.attributes
        const auxFeatures = lastCurrentThing.features
        const auxPolicyId = lastCurrentThing.policyId
        setCurrentThing({
            ...lastCurrentThing,
            thingId : aux.thingId
        })
        setLastCurrentThing(aux)
        updateUseStates({attributes: auxAttributes, features: auxFeatures, policyId: auxPolicyId})
    }

    const handleOnChangeInputAttribute = (event:ChangeEvent<HTMLInputElement>) => {
      setCurrentThing({
          ...currentThing,
          attributes : {
              ...currentThing.attributes,
              [event.currentTarget.name] : event.target.value
          }
      })
    }

    const updateUseStates = (data:{attributes?:any, features?:any, policyId:string}) => {
        setAttributes((data.attributes !== undefined) ? JSONtoIAttributes(data.attributes) : [])
        setFeatures((data.features !== undefined) ? JSONtoIFeatures(data.features) : [])
        setSelectedPolicy({
            label : data.policyId,
            value : data.policyId
        })
    }

    const typeForm = (control:Control<IDittoThingForm>) => {
        return (
          <Fragment>
            <Field className="mt-3" label="Type of twin" required={true}>
              <InputControl
                render={({field}) => 
                  <Select {...field} 
                    options={types}
                    value={type}
                    onChange={v => setType(v)}
                    prefix={<Icon name="arrow-down"/>} 
                  />
                }
                control={control}
                name="type"
              />
            </Field>
            <Field label="Customize some property of the type for this twin">
              <Switch value={customizeType} onChange={v => {
                setCustomizeType(!customizeType)
              }}/>
            </Field>
          </Fragment>
        )
    }

    const fromRadioButton = (control:Control<IDittoThingForm>) => {
        return (
            <Fragment>
                <HorizontalGroup justify='center'>
                    <RadioButtonGroup
                        options={options}
                        value={selected}
                        onChange={handleOnChangeFrom}
                    />
                </HorizontalGroup>
                {(selected === enumOptions.FROM_TYPE) ? typeForm(control) : (<div></div>)}
            </Fragment>
        )
    }

    useEffect(() => {
        setCurrentThing({
            ...currentThing,
            policyId : ((selectedPolicy !== undefined && selectedPolicy.value !== undefined) ? selectedPolicy.value : "")
        })
    }, [selectedPolicy])

    useEffect(() => {
        var jsonAttributes:any = {}
        attributes.forEach((item:IAttribute) => jsonAttributes[(item.key)] = item.value)

        setCurrentThing({
            ...currentThing,
            attributes : jsonAttributes
        }
        )
    }, [attributes])

    useEffect(() => {
        var jsonFeatures:any = {}
        features.forEach((item:IFeature) => jsonFeatures[(item.name)] = { properties : item.properties});

        setCurrentThing({
            ...currentThing,
            features : jsonFeatures
        }
        )
    }, [features])

    useEffect(() => {
    }, [selected, showNotification])

    useEffect(() => {
        setCurrentThing({
            ...currentThing,
            thingId : thingIdField.id + ":" + thingIdField.namespace
        })
    }, [thingIdField])

    useEffect(() => {
        if(type?.value !== undefined) {
            const typeValue = type.value
            const attributesWithType = {
                ...typeValue.attributes,
                type: typeValue.thingId
            }
            setCurrentThing({
                ...currentThing,
                policyId : typeValue.policyId,
                definition : typeValue.definition,
                attributes : attributesWithType,
                features : typeValue.features
            })
            updateUseStates(typeValue)
        }
    }, [type, customizeType])

   
    useEffect(() => {
        if (isType) {
            setSelected(enumOptions.FROM_ZERO)
        } else {
            getAllTypesService(context).then((res) => setTypes(getSelectWithObjectsFromThingsArray(res)))
            .catch(() => console.log("error"))
        }
        getAllPoliciesService(context).then((res:IPolicy[]) => {
            setPolicies(res.map((item:IPolicy) => {
            return {
                label : item.policyId,
                value : item.policyId
            }
        }))
        }).catch(() => console.log("error"))
    }, [])

    return (
        <Fragment>
            {notification()}
            <h2 style={{marginBottom: '0px', paddingBottom: '0px'}}>Create new {title}</h2>
            {headerIfIsChild()}
            <div className="row">
                <div className="col-7">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth="none" style={{marginTop: '0px', paddingTop: '0px'}}>
                    {({register, errors, control}:FormAPI<IDittoThingForm>) => {
                        return(
                            <Fragment>
                                <ElementHeader className="mt-5" title="Identification" description={descriptionID} isLegend={true}/>
                                
                                <Field label="Id" description={descriptionThingId} required={true}>
                                    <Input {...register("id", { required : true })} type="text" value={thingIdField.id} onChange={handleOnChangeThingId}/>
                                </Field>
 
                                <Field label="Namespace" description={descriptionNamespace} required={true}>
                                    <Input {...register("namespace", { required : true })} type="text" value={thingIdField.namespace} onChange={handleOnChangeThingId}/>
                                </Field>
                                
                                <ElementHeader className="mt-5" title={`${capitalize(title)} information`} description={descriptionInformation} isLegend={true}/>
                                {(isType === false) ? fromRadioButton(control) : (<div></div>)}
                                
                                <Field label="Policy" disabled={!customizeType && selected === enumOptions.FROM_TYPE} required={true}>
                                    <InputControl
                                        render={({field}) => 
                                            <Select {...field}
                                                options={policies}
                                                value={selectedPolicy}
                                                onChange={v => setSelectedPolicy(v)}
                                                prefix={<Icon name="arrow-down"/>} 
                                                disabled={!customizeType && selected === enumOptions.FROM_TYPE}
                                            />
                                        }
                                        control={control}
                                        name="policyId"
                                    />
                                </Field>

                                <Field label="Name" description="" required={false}>
                                    <Input {...register("name", { required : false })} type="text" value={currentThing.attributes.name} onChange={handleOnChangeInputAttribute}/>
                                </Field>

                                <Field label="Description" description="">
                                    <Input {...register("description", { required : false })} type="text" value={currentThing.attributes.description} onChange={handleOnChangeInputAttribute}/>
                                </Field>

                                <Field label="Image" description="">
                                    <Input {...register("image", { required : false })} type="text" value={currentThing.attributes.image} onChange={handleOnChangeInputAttribute}/>
                                </Field>

                                <hr/>
                            </Fragment>
                        )
                    }}
                    </Form>
                    <FormAttributes attributes={attributes} setAttributes={setAttributes} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    <hr/>
                    <FormFeatures features={features} setFeatures={setFeatures} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    <hr/>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="primary" type="submit" form="finalForm">Create {title}</Button>
                    </div>
                </div>
                <div className="col-5" style={{minHeight: '100%'}}>
                    <Field label="Preview" style={{minHeight: '1%', marginBottom: '0px', paddingBottom: '0px'}}>
                        <div></div>
                    </Field>
                    <TextArea style={{resize: 'none', minHeight: '99%', flex: 1, overflow: "auto", boxSizing: 'border-box' }} value={JSON.stringify(currentThing, undefined, 4)} rows={25} readOnly/>
                </div>
            </div>
        </Fragment>
    )
}