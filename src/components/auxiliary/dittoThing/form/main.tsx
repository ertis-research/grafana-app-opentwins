import React, { useState, Fragment, useEffect, useContext, ChangeEvent } from 'react'
import { AppPluginMeta, KeyValue, SelectableValue } from '@grafana/data'
import { IAttribute, IDittoThing, IDittoThingData, IDittoThingForm, IFeature, IThingId } from 'utils/interfaces/dittoThing'
import { Form, FormAPI, Field, Input, InputControl, Select, Icon, TextArea, Button, HorizontalGroup, RadioButtonGroup, Switch, useTheme2 } from '@grafana/ui'
import { SelectData } from 'utils/interfaces/select'
import { ElementHeader } from 'components/auxiliary/general/elementHeader'
import { basicAttributesConst, enumOptions, options, restrictedAttributesConst, staticAttributesConst } from 'utils/data/consts'
import { Control } from 'react-hook-form'
import { FormAttributes } from 'components/auxiliary/dittoThing/form/subcomponents/formAttributes'
import { FormFeatures } from 'components/auxiliary/dittoThing/form/subcomponents/formFeatures'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { getSelectWithObjectsFromThingsArray, JSONtoIAttributes, JSONtoIFeatures, splitThingId } from 'utils/auxFunctions/dittoThing'
import { getAllTypesService } from 'services/types/getAllTypesService'
import { capitalize, enumNotification } from 'utils/auxFunctions/general'
import { StaticContext } from 'utils/context/staticContext'
import { CustomNotification } from 'components/auxiliary/general/notification'
import { Notification } from 'utils/interfaces/notification'

interface Parameters {
    path: string
    parentId?: string
    thingToEdit?: IDittoThing
    isType: boolean
    meta: AppPluginMeta<KeyValue<any>>
    funcFromType?: any
    funcFromZero: (thingId: string, data: IDittoThingData, num?: number) => Promise<any>
}

export const ThingForm = ({ path, parentId, thingToEdit, isType, funcFromType, funcFromZero }: Parameters) => {
    const [lastCurrentThing, setLastCurrentThing] = useState<IDittoThing>({ thingId: "", policyId: "", attributes: {}})
    const [currentThing, setCurrentThing] = useState<IDittoThing>(lastCurrentThing)
    const [thingIdField, setThingIdField] = useState<IThingId>({id: "", namespace: ""})
    const [type, setType] = useState<SelectableValue<IDittoThing>>()
    const [types, setTypes] = useState<SelectData[]>([])
    const [selected, setSelected] = useState(enumOptions.FROM_TYPE)
    const [customizeType, setCustomizeType] = useState(false)
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [features, setFeatures] = useState<IFeature[]>([])
    const [policies, setPolicies] = useState<SelectData[]>([])
    const [selectedPolicy, setSelectedPolicy] = useState<SelectableValue<string>>()
    const [showNotification, setShowNotification] = useState<Notification>({state: enumNotification.HIDE, title: ""})
    const [staticAttributes, setStaticAttributes] = useState<any>([])
    const [numChildren, setNumChildren] = useState<number>(1)


    const context = useContext(StaticContext)

    const allowFromType = (isType || thingToEdit) ? false : true
    const title = (isType) ? "type" : "twin"
    const descriptionID = "Identity associated with the authentication credentials"
    const descriptionInformation = "Basic information for creating the Ditto thing"
    const descriptionThingId = `Thing ID. This must be unique within the scope of the ${title}. The name of the ${title} will precede it automatically.`
    const descriptionNamespace = `Name of the context to which the ${title} belongs.`
    const descriptionChildren = "Number of children of this type owned by parent"

    
// -----------------------------------------------------------------------------------------------
// help functions
// -----------------------------------------------------------------------------------------------

    const clearFields = () => {
        setThingIdField({ id : "", namespace: ""})
        setSelectedPolicy(undefined)
        setAttributes([])
        setFeatures([])
        if(allowFromType) {
            setCustomizeType(false)
            setType(undefined)
            setSelected(enumOptions.FROM_TYPE)
        }
        setLastCurrentThing({ thingId: "", policyId: "", attributes: { name: "", description: "", image: "", type: ""}})
        setCurrentThing({ thingId: "", policyId: "", attributes: { name: "", description: "", image: "", type: ""}})
        setShowNotification({state: enumNotification.HIDE, title: ""})
    }

    const onDismissFunc = () => {
        setThingIdField({
            ...thingIdField,
            id : ""
        })
    }

    const notificationError: Notification = {
        state: enumNotification.ERROR,
        title: `The ${title} has not been ${(thingToEdit) ? "edited" : "created"} correctly. `,
        description: "Please check the data you have entered."
    }

    const notificationSuccess: Notification = (thingToEdit) ? {
        state: enumNotification.SUCCESS,
        title: `The ${title} has been edited correctly. `,
        description: `You can leave the page if you don't want to edit any more.`
    } : {
        state: enumNotification.SUCCESS,
        title: `The ${title} has been created correctly. `,
        description: `You can delete the fields to create a new ${title}, keep them if you want to create a similar one or leave the page if you don't want to create any more.`,
        confirmText: "Clear fields",
        dismissText: "Keep fields", 
        onConfirmFunc: clearFields,
        onDismissFunc:  onDismissFunc
    }


// -----------------------------------------------------------------------------------------------
// help functions
// -----------------------------------------------------------------------------------------------

    const setDittoThing = (thing: IDittoThing) => {
        if(thing.attributes) {
            setStaticAttributes(getListPropertiesToObject(thing.attributes, staticAttributesConst))
            Object.keys(thing.attributes).forEach((key: string) => {
                if(restrictedAttributesConst.includes(key) || staticAttributesConst.includes(key)) {delete thing.attributes[key]}
            })
        }
        const basicAttributes = getListPropertiesToObject(thing.attributes, basicAttributesConst)
        basicAttributesConst.forEach((key: string) => delete thing.attributes[key])
        setCurrentThing({
            ...currentThing,
            thingId: thing.thingId,
            policyId: thing.policyId,
            attributes: {
                ...basicAttributes,
                ...currentThing.attributes
            },
            features: thing.features
        })
        setThingIdField(splitThingId(thing.thingId))

        updateUseStates({
            policyId: thing.policyId,
            attributes: thing.attributes,
            features: thing.features
        })
    }

    const updateUseStates = (data: {attributes?: any, features?: any, policyId: string}) => {
        setAttributes((data.attributes !== undefined) ? JSONtoIAttributes(data.attributes) : [])
        setFeatures((data.features !== undefined) ? JSONtoIFeatures(data.features) : [])
        setSelectedPolicy({
            label : data.policyId,
            value : data.policyId
        })
    }

    const getListPropertiesToObject = (object: any, properties: string[]) => {
        let res = {}
        properties.forEach((property: string) => {
            if(object.hasOwnProperty(property)){
                res = {
                    ...res,
                    [property] : JSON.parse(JSON.stringify(object[property]))
                }
            }
        })
        return res
    }

// -----------------------------------------------------------------------------------------------
// handles
// -----------------------------------------------------------------------------------------------

    const handleOnSubmitFinal = (data: IDittoThingForm) => {
        const thingId = currentThing.thingId
        const finalData: IDittoThingData = {
            policyId : currentThing.policyId,
            definition : currentThing.definition,
            attributes : {
                ...currentThing.attributes,
                ...staticAttributes
            },
            features : currentThing.features
        }
        let funcToExecute: any = undefined
        console.log("finalData", JSON.stringify(finalData))
        if(selected === enumOptions.FROM_TYPE && type?.value !== undefined && allowFromType){
            if(customizeType){
                funcToExecute = funcFromType(thingId, type.value.thingId, finalData)
            } else {
                funcToExecute = funcFromType(thingId, type.value.thingId)
            }
        } else if(isType) {
            funcToExecute = funcFromZero(thingId, finalData, numChildren)
        } else {
            funcToExecute = funcFromZero(thingId, finalData)
        }
        setShowNotification({state: enumNotification.LOADING, title: ""})
        try {
            funcToExecute.then(() => {
                console.log("OK")
                setShowNotification(notificationSuccess)
                
            }).catch(() => {
                console.log("error")
                setShowNotification(notificationError)
            })
        } catch (e) {
            console.log("error")
            setShowNotification(notificationError)
        }
    }

    const handleOnChangeThingId = (event: ChangeEvent<HTMLInputElement>) => {
        setThingIdField({
            ...thingIdField,
            [event.currentTarget.name] : event.target.value
        })
    }

    const handleOnChangeNumChildren = (event: ChangeEvent<HTMLInputElement>) => {
        setNumChildren(Number(event.target.value))
    }

    const handleOnChangeFrom = (value: number) => {
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

    const handleOnChangeInputAttribute = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentThing({
            ...currentThing,
            attributes : {
                ...currentThing.attributes,
                [event.currentTarget.name] : event.target.value
            }
        })
    }



// -----------------------------------------------------------------------------------------------
// useEffect
// -----------------------------------------------------------------------------------------------

    useEffect(() => {
        setCurrentThing({
            ...currentThing,
            policyId : ((selectedPolicy !== undefined && selectedPolicy.value !== undefined) ? selectedPolicy.value : "")
        })
    }, [selectedPolicy])

    useEffect(() => {
        let jsonAttributes: any = {}
        const basicAttributes = getListPropertiesToObject(currentThing.attributes, basicAttributesConst)
        
        attributes.forEach((item: IAttribute) => jsonAttributes[(item.key)] = item.value)
        setCurrentThing({
            ...currentThing,
            attributes : {
                ...basicAttributes,
                ...jsonAttributes
            }
        })
    }, [attributes])

    useEffect(() => {
        let jsonFeatures: any = {}
        features.forEach((item: IFeature) => jsonFeatures[(item.name)] = { properties : item.properties});

        setCurrentThing({
            ...currentThing,
            features : jsonFeatures
        })
    }, [features])

    useEffect(() => {
    }, [selected, showNotification])

    useEffect(() => {
        setCurrentThing({
            ...currentThing,
            thingId : thingIdField.namespace + ":" + thingIdField.id
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
        console.log("currentThing useEffect", JSON.stringify(currentThing))
    }, [currentThing])

    useEffect(() => {
        if (!allowFromType) {
            setSelected(enumOptions.FROM_ZERO)
        } else {
            getAllTypesService(context).then((res) => setTypes(getSelectWithObjectsFromThingsArray(res)))
            .catch(() => console.log("error"))
        }

        getAllPoliciesService(context).then((res: string[]) => {
            setPolicies(res.map((item: string) => {
            return {
                label : item,
                value : item
            }
        }))
        }).catch(() => console.log("error"))

        if(thingToEdit){
            setDittoThing(thingToEdit)
        }
    }, [])
    

// -----------------------------------------------------------------------------------------------
// html
// -----------------------------------------------------------------------------------------------
    
    const titleIfMode = (thingToEdit) ? 
        <h2 style={{marginBottom: '0px', paddingBottom: '0px'}}>Edit {title} with id {thingToEdit.thingId}</h2>
        : <h2 style={{marginBottom: '0px', paddingBottom: '0px'}}>Create new {title}</h2> 

    const headerIfIsChild = (parentId !== null && parentId !== undefined) ? 
        <h4 style={{color:useTheme2().colors.text.secondary}}>To be child of {title} with id: {parentId}</h4>
        : <div style={{height: '0px'}}></div>

    const typeForm = (control: Control<IDittoThingForm>) => {
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
    
    const fromRadioButton = (control: Control<IDittoThingForm>) => {
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

    const numChildrenInput = (parentId !== null && parentId !== undefined && isType) ? 
        <Field label="Number of children" description={descriptionChildren} required={true} className="mt-4">
            <Input type="number" value={numChildren} onChange={handleOnChangeNumChildren}/>
        </Field>
        : <div></div>

    return (
        <Fragment>
            <CustomNotification notification={showNotification} setNotificationFunc={setShowNotification}/>
            {titleIfMode}
            {headerIfIsChild}
            <div className="row">
                <div className="col-7">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal} maxWidth="none" style={{marginTop: '0px', paddingTop: '0px'}}>
                    {({register, errors, control}: FormAPI<IDittoThingForm>) => {
                        return(
                            <Fragment>
                                {numChildrenInput}
                                <ElementHeader className="mt-5" title="Identification" description={descriptionID} isLegend={true}/>
                                
                                <Field label="Namespace" description={descriptionNamespace} required={!thingToEdit} disabled={thingToEdit !== undefined}>
                                    <Input {...register("namespace", { required : !thingToEdit })} disabled={thingToEdit !== undefined} type="text" value={thingIdField.namespace} onChange={handleOnChangeThingId}/>
                                </Field>

                                <Field label="Id" description={descriptionThingId} required={!thingToEdit} disabled={thingToEdit !== undefined}>
                                    <Input {...register("id", { required : !thingToEdit })} type="text" disabled={thingToEdit !== undefined} value={thingIdField.id} onChange={handleOnChangeThingId}/>
                                </Field>
                                
                                <ElementHeader className="mt-5" title={`${capitalize(title)} information`} description={descriptionInformation} isLegend={true}/>
                                {(allowFromType) ? fromRadioButton(control) : (<div></div>)}
                                
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
                        <Button variant="primary" type="submit" form="finalForm">{(thingToEdit) ? "Edit" : "Create"} {title}</Button>
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
