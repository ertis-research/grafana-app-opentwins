import React, { useState, Fragment, useEffect, useContext, ChangeEvent } from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IAttribute, IDittoThing, IDittoThingData, IDittoThingForm, IFeature } from 'utils/interfaces/dittoThing'
import { Form, FormAPI, Field, Input, InputControl, Select, Icon, TextArea, Button, HorizontalGroup, RadioButtonGroup, Switch, useTheme2, Alert } from '@grafana/ui'
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
import { createTwinFromTypeService } from 'services/types/createTwinFromTypeService'
import { createOrUpdateTwinByIdService } from 'services/twins/crud/createOrUpdateTwinByIdService'
import { getSelectWithObjectsFromThingsArray, JSONtoIAttributes, JSONtoIFeatures } from 'utils/auxFunctions/dittoThing'
import { getAllTypesService } from 'services/types/getAllTypesService'

const enumNotification = {
    SUCCESS : "success",
    ERROR : "error",
    HIDE : "hide"
}


interface parameters {
    path : string
    parentId ?: string
    meta: AppPluginMeta<KeyValue<any>>
}

export const TwinForm = ({ path, parentId } : parameters) => {
    const [lastCurrentTwin, setLastCurrentTwin] = useState<IDittoThing>({ thingId: "", policyId: "", attributes: {}})
    const [currentTwin, setCurrentTwin] = useState<IDittoThing>(lastCurrentTwin)
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

    if(false){
        setLastCurrentTwin({ thingId: "", policyId: "", attributes: {}})
        setType({ thingId: "", policyId: "", attributes: {}})
        console.log(types)
        setSelected(enumOptions.FROM_TYPE)
        setCustomizeType(false)
        console.log(policies)
        setShowNotification(enumNotification.HIDE)
    }

    const descriptionID = "Identity associated with the authentication credentials"
    const descriptionInformation = "Basic information for creating the Ditto thing"
    const descriptionThingId = "Thing ID. This must be unique within the scope of the twin. The name of the twin will precede it automatically."
    //const descriptionPassword = "Password to authenticate when sending data from the sensor to eclipse Hono."
    const descriptionNamespace = "AA"
    const messageSuccess = "The twin has been created correctly. You can leave this page if you do not want to create any more."
    const messageError = "The twin has not been created correctly. Please check the data you have entered."

    const headerIfIsChild = () => {
        if(parentId != null){
            return <h4 style={{color:useTheme2().colors.text.secondary}}>To be child of twin with id: {parentId}</h4>
        } else {
            return <div></div>
        }
        if(false){
        }
    }

    const notification = () => {
        switch(showNotification) {
            case enumNotification.SUCCESS:
                return <Alert title={messageSuccess} severity={"success"} elevated />
            case enumNotification.ERROR:
                return <Alert title={messageError} severity={"error"} elevated />
            default:
                return <div></div>
        }
    }

    const handleOnSubmitFinal = (data:IDittoThingForm) => {
        const twinId = data.namespace + ":" + data.id
        const finalData:IDittoThingData = {
            policyId : currentTwin.policyId,
            definition : currentTwin.definition,
            attributes : currentTwin.attributes,
            features : currentTwin.features
        }
        
        if(selected === enumOptions.FROM_TYPE && type?.value !== undefined){
            if(customizeType){
              createTwinFromTypeService(context, twinId, type.value.thingId, finalData).then(() =>
                setShowNotification(enumNotification.SUCCESS)
              ).catch(() => console.log("error"))
            } else {
              createTwinFromTypeService(context, twinId, type.value.thingId).then(() =>
                setShowNotification(enumNotification.SUCCESS)
              ).catch(() => console.log("error"))
            }
            
          } else {
            createOrUpdateTwinByIdService(context, twinId, finalData).then(() =>
              setShowNotification(enumNotification.SUCCESS)
            ).catch(() => console.log("error"))
          }

    }

    const handleOnChangeId = (event:ChangeEvent<HTMLInputElement>) => {
        const split = currentTwin.thingId.split(":")
        setCurrentTwin({
            ...currentTwin,
            thingId : (split.length < 1) ? ":" + event.target.value : split[0] + ":" + event.target.value
        })
    }

    const handleOnChangeNamespace = (event:ChangeEvent<HTMLInputElement>) => {
        const split = currentTwin.thingId.split(":")
        setCurrentTwin({
            ...currentTwin,
            thingId : (split.length < 2) ? event.target.value + ":" : event.target.value + ":" + split[1]
        })
    }

    const handleOnChangeFrom = (value:number) => {
        setSelected(value)
        const aux = currentTwin
        const auxAttributes = lastCurrentTwin.attributes
        const auxFeatures = lastCurrentTwin.features
        const auxPolicyId = lastCurrentTwin.policyId
        setCurrentTwin({
            ...lastCurrentTwin,
            thingId : aux.thingId
        })
        setLastCurrentTwin(aux)
        updateUseStates({attributes: auxAttributes, features: auxFeatures, policyId: auxPolicyId})
    }

    const handleOnChangeInputAttribute = (event:ChangeEvent<HTMLInputElement>) => {
      setCurrentTwin({
          ...currentTwin,
          attributes : {
              ...currentTwin.attributes,
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

    useEffect(() => {
        setCurrentTwin({
            ...currentTwin,
            policyId : ((selectedPolicy !== undefined && selectedPolicy.value !== undefined) ? selectedPolicy.value : "")
        })
    }, [selectedPolicy])

    useEffect(() => {
        var jsonAttributes:any = {}
        attributes.forEach((item:IAttribute) => jsonAttributes[(item.key)] = item.value)

        setCurrentTwin({
            ...currentTwin,
            attributes : jsonAttributes
        }
        )
    }, [attributes])

    useEffect(() => {
        var jsonFeatures:any = {}
        features.forEach((item:IFeature) => jsonFeatures[(item.name)] = { properties : item.properties});

        setCurrentTwin({
            ...currentTwin,
            features : jsonFeatures
        }
        )
    }, [features])

    useEffect(() => {
    }, [selected])

    useEffect(() => {
        if(type?.value !== undefined) {
            const typeValue = type.value
            const attributesWithType = {
                ...typeValue.attributes,
                type: typeValue.thingId
            }
            setCurrentTwin({
                ...currentTwin,
                policyId : typeValue.policyId,
                definition : typeValue.definition,
                attributes : attributesWithType,
                features : typeValue.features
            })
            updateUseStates(typeValue)
        }
    }, [type, customizeType])

   
    useEffect(() => {
        getAllTypesService(context).then((res) => setTypes(getSelectWithObjectsFromThingsArray(res)))
            .catch(() => console.log("error"))
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
            {notification}
            <h2 className="mb-0">Create new twin</h2>
            {headerIfIsChild}
            <div className="row">
                <div className="col-8">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal}>
                    {({register, errors, control}:FormAPI<IDittoThingForm>) => {
                        return(
                            <Fragment>
                                <ElementHeader className="mt-5" title="Identification" description={descriptionID} isLegend={true}/>
                                
                                <Field label="Id" description={descriptionThingId} required={true}>
                                    <Input {...register("id", { required : true })} type="text" onChange={handleOnChangeId}/>
                                </Field>
 
                                <Field label="Namespace" description={descriptionNamespace} required={true}>
                                    <Input {...register("namespace", { required : true })} type="text" onChange={handleOnChangeNamespace}/>
                                </Field>
                                 
                                <ElementHeader className="mt-5" title="Twin information" description={descriptionInformation} isLegend={true}/>
                                <HorizontalGroup justify='center'>
                                    <RadioButtonGroup
                                        options={options}
                                        value={selected}
                                        onChange={handleOnChangeFrom}
                                    />
                                </HorizontalGroup>
                                {(selected === enumOptions.FROM_TYPE) ? typeForm(control) : (<div></div>)}
                                
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
                                    <Input {...register("name", { required : false })} type="text" value={currentTwin.attributes.name} onChange={handleOnChangeInputAttribute}/>
                                </Field>

                                <Field label="Description" description="">
                                    <Input {...register("description", { required : false })} type="text" value={currentTwin.attributes.description} onChange={handleOnChangeInputAttribute}/>
                                </Field>

                                <Field label="Image" description="">
                                    <Input {...register("image", { required : false })} type="text" value={currentTwin.attributes.image} onChange={handleOnChangeInputAttribute}/>
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
                    <Button variant="primary" type="submit" form="finalForm">Create twin</Button>
                </div>
                <div className="col-4" style={{minHeight: '100%'}}>
                    <Field label="Preview" style={{ minHeight: "100%" }} >
                        <TextArea style={{resize: 'none', minHeight: '100%', flex: 1, overflow: "auto", boxSizing: 'border-box' }} value={JSON.stringify(currentTwin, undefined, 4)} rows={25} readOnly/>
                    </Field>
                </div>
            </div>
        </Fragment>
    )
}