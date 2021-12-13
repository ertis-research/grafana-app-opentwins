import React, { useState, Fragment, useEffect, useContext, ChangeEvent } from 'react'
import { IAttribute, IDittoThing, IDittoThingWithCredentials, IFeature } from 'utils/interfaces/dittoThing'
import { Form, FormAPI, Field, Input, InputControl, Select, Icon, TextArea, Button, HorizontalGroup, RadioButtonGroup, Switch, Checkbox, useTheme2 } from '@grafana/ui'
import { SelectableValue } from '@grafana/data/types/select'
import { ISelect } from 'utils/interfaces/select'
import { getAllThingTypesService } from 'services/thingTypes/getAllThingTypesService'
import { getSelectWithObjectsFromThingTypesArray, JSONtoIAttributes, JSONtoIFeatures } from 'utils/aux_functions'
import { ElementHeader } from 'components/general/elementHeader'
import { IThingType } from 'utils/interfaces/types'
import { createThingByTypeService } from 'services/things/createThingByTypeService'
import { enumOptions, options } from 'utils/data/consts'
import { Control } from 'react-hook-form'
import { FormAttributes } from 'components/types/form/subcomponents/formAttributes'
import { FormFeatures } from 'components/types/form/subcomponents/formFeatures'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { IPolicy } from 'utils/interfaces/dittoPolicy'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { StaticContext } from 'utils/context/staticContext'

interface parameters {
    path : string
    id : string
    meta: AppPluginMeta<KeyValue<any>>
}

export const ThingForm = ({ path, id } : parameters) => {
    
    const [lastCurrentThing, setLastCurrentThing] = useState<IDittoThing>({ thingId: id + ":", policyId: ""})
    const [currentThing, setCurrentThing] = useState<IDittoThing>(lastCurrentThing)
    const [value, setValue] = useState<SelectableValue<IThingType>>()
    const [thingTypes, setThingTypes] = useState<ISelect[]>([])
    const [selected, setSelected] = useState(enumOptions.FROM_TYPE)
    const [customizeType, setCustomizeType] = useState(false)
    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [features, setFeatures] = useState<IFeature[]>([])
    const [policies, setPolicies] = useState<ISelect[]>([])
    const [selectedPolicy, setSelectedPolicy] = useState<SelectableValue<string>>()
    const [createEclipseHonoDevice, setCreateEclipseHonoDevice] = useState(true)

    const context = useContext(StaticContext)

    const descriptionIDandConnect = "Identity associated with the authentication credentials"
    const descriptionInformation = "Basic information for creating the Ditto thing"
    const descriptionThingId = "Thing ID. This must be unique within the scope of the twin. The name of the twin will precede it automatically. This will also be the identifier for the connection."
    const descriptionPassword = "Password to authenticate when sending data from the sensor to eclipse Hono."

    const handleOnSubmitFinal = (data:IDittoThingWithCredentials) => {
        currentThing.thingId = data.thingId
        /*createThingService(currentThing, id, data.authid, data.password).then(() => 
            alert("CREADO")
            //window.location.replace(path + "?mode=check&id=" + id)
        )*/
        if(value?.value !== undefined){
            createThingByTypeService(context, data.thingId, value.value.thingTypeId, id, id, data.password).then(() => 
            alert("CREADO")
        //window.location.replace(path + "?mode=check&id=" + id)
        )
        }
        

    }

    const handleOnChangeThingId = (event:ChangeEvent<HTMLInputElement>) => {
        setCurrentThing({
            ...currentThing,
            thingId : id + ":" + event.target.value
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

    const updateUseStates = (data:{attributes?:any, features?:any, policyId:string}) => {
        setAttributes((data.attributes !== undefined) ? JSONtoIAttributes(data.attributes) : [])
        setFeatures((data.features !== undefined) ? JSONtoIFeatures(data.features) : [])
        setSelectedPolicy({
            label : data.policyId,
            value : data.policyId
        })
    }

    const typeForm = (control:Control<IDittoThingWithCredentials>) => {
        return (
          <Fragment>
            <Field className="mt-3" label="Type of thing" required={true}>
              <InputControl
                render={({field}) => 
                  <Select {...field} 
                    options={thingTypes}
                    value={value}
                    onChange={v => setValue(v)}
                    prefix={<Icon name="arrow-down"/>} 
                  />
                }
                control={control}
                name="type"
              />
            </Field>
            <Field label="Customize some property of the type for this thing">
              <Switch value={customizeType} onChange={v => {
                setCustomizeType(!customizeType)
              }}/>
            </Field>
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
    }, [selected, createEclipseHonoDevice])

    useEffect(() => {
        if(value?.value !== undefined) {
            const type = value.value
            const attributesWithType = {
                ...type.attributes,
                type: type.thingTypeId
            }
            setCurrentThing({
                ...currentThing,
                policyId : type.policyId,
                definition : type.definition,
                attributes : attributesWithType,
                features : type.features
            })
            updateUseStates(type)
        }
    }, [value, customizeType])

    useEffect(() => {
        getAllThingTypesService(context).then((res) => setThingTypes(getSelectWithObjectsFromThingTypesArray(res)))
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
            <h2 className="mb-0">Create new thing</h2>
            <h4 style={{color:useTheme2().colors.text.secondary}}>For twin with id {id}</h4>
            <div className="row">
                <div className="col-8">
                    <Form id="finalForm" onSubmit={handleOnSubmitFinal}>
                    {({register, errors, control}:FormAPI<IDittoThingWithCredentials>) => {
                        return(
                            <Fragment>
                                <ElementHeader className="mt-5" title="Identification and connection" description={descriptionIDandConnect} isLegend={true}/>
                                <Field label="ID" description={descriptionThingId}>
                                    <Input {...register("thingId", { required : true })} type="text" onChange={handleOnChangeThingId}/>
                                </Field>

                                <Checkbox
                                    className="mb-2"
                                    value={createEclipseHonoDevice}
                                    onChange={v => setCreateEclipseHonoDevice(v.currentTarget.checked)}
                                    label="Create also Eclipse Hono device with credentials for this thing"
                                />

                                <Field label="Password" description={descriptionPassword} disabled={!createEclipseHonoDevice}>
                                    <Input {...register("password", { required : true })} type="password" disabled={!createEclipseHonoDevice}/>
                                </Field>

                                <ElementHeader className="mt-5" title="Thing information" description={descriptionInformation} isLegend={true}/>
                                <HorizontalGroup justify='center'>
                                    <RadioButtonGroup
                                        options={options}
                                        value={selected}
                                        onChange={handleOnChangeFrom}
                                    />
                                </HorizontalGroup>
                                {(selected === enumOptions.FROM_TYPE) ? typeForm(control) : (<div></div>)}
                                
                                <Field label="Policy" disabled={!customizeType && selected === enumOptions.FROM_TYPE}>
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
                                <hr/>
                            </Fragment>
                        )
                    }}
                    </Form>
                    <FormAttributes attributes={attributes} setAttributes={setAttributes} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    <hr/>
                    <FormFeatures features={features} setFeatures={setFeatures} disabled={!customizeType && selected === enumOptions.FROM_TYPE}/>
                    <hr/>
                    <Button variant="primary" type="submit" form="finalForm">Create thing</Button>
                </div>
                <div className="col-4" style={{minHeight: '100%'}}>
                    <Field label="Preview" style={{ minHeight: "100%" }} >
                        <TextArea style={{resize: 'none', minHeight: '100%', flex: 1, overflow: "auto", boxSizing: 'border-box' }} value={JSON.stringify(currentThing, undefined, 4)} rows={25} readOnly/>
                    </Field>
                </div>
            </div>
        </Fragment>
    )
}