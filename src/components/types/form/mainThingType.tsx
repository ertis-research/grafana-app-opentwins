import React, { Fragment, useState, useEffect, useContext, ChangeEvent} from 'react'
import { Button, Field, TextArea, Input, Form, FormAPI, Select, Icon, FieldSet, InputControl } from '@grafana/ui'
import {} from '@emotion/core'; //https://github.com/grafana/grafana/issues/26512
import { createThingTypeService } from 'services/thingTypes/createThingTypeService'
import { IAttribute, IFeature } from 'utils/interfaces/dittoThing'
import { FormAttributes } from './subcomponents/formAttributes'
import { FormFeatures } from './subcomponents/formFeatures'
import { getAllPoliciesService } from 'services/policies/getAllPoliciesService'
import { ISelect } from 'utils/interfaces/select'
import { SelectableValue } from '@grafana/data/types/select'
import { IThingType, IThingTypeSimple } from 'utils/interfaces/types';
import { IPolicy } from 'utils/interfaces/dittoPolicy';
import { StaticContext } from 'utils/context/staticContext';

interface parameters {
  path : string
}

export const FormThingType = ({path} : parameters) => {

    const [attributes, setAttributes] = useState<IAttribute[]>([])
    const [features, setFeatures] = useState<IFeature[]>([])
    const [currentType, setCurrentType] = useState<IThingType>({thingTypeId:"", policyId:""})
    const [policies, setPolicies] = useState<ISelect[]>([])
    const [value, setValue] = useState<SelectableValue<string>>()

    const context = useContext(StaticContext)

    const handleFinalSubmit = (data:IThingType) => {
      setCurrentType({
        ...currentType,
        thingTypeId : data.thingTypeId
      })
      createThingTypeService(context, currentType).then(() => 
        window.location.replace(path + "?tab=types")
      )
    }
  
    useEffect(() => {
      setCurrentType({
        ...currentType,
          policyId : ((value !== undefined && value.value !== undefined) ? value.value : "")
      })
    }, [value])

    useEffect(() => {
      var jsonAttributes:any = {}
      attributes.forEach((item:IAttribute) => jsonAttributes[(item.key)] = item.value)

      setCurrentType({
        ...currentType,
          attributes : jsonAttributes
        }
      )
    }, [attributes])

    useEffect(() => {
      var jsonFeatures:any = {}
      features.forEach((item:IFeature) => jsonFeatures[(item.name)] = { properties : item.properties});

      setCurrentType({
        ...currentType,
          features : jsonFeatures
        }
      )
    }, [features])

    useEffect(() => {
      getAllPoliciesService(context).then((res:IPolicy[]) => {
        setPolicies(res.map((item:IPolicy) => {
          return {
              label : item.policyId,
              value : item.policyId
          }
      }))
      }).catch(() => console.log("error"))
    }, [])

    const handleOnChangeInputName = (event:ChangeEvent<HTMLInputElement>) => {
      setCurrentType({
        ...currentType,
        thingTypeId : event.target.value
      })
    }

    return (
      <Fragment>
        <h2>Create new type of thing</h2>
        <div className="row">
          <div className="col-8">
            <Form id="formTypeFinal" onSubmit={handleFinalSubmit}>
              {({register, errors, control}:FormAPI<IThingTypeSimple>) => {
                return (
                  <FieldSet>
                    <Field label="Name">
                      <Input {...register("thingTypeId", {required:true})} type="text" onChange={handleOnChangeInputName}/>
                    </Field>
                    <Field label="Policy">
                      <InputControl
                        render={({field}) => 
                          <Select {...field} 
                            options={policies}
                            value={value}
                            onChange={v => setValue(v)}
                            prefix={<Icon name="arrow-down"/>} 
                          />
                        }
                        control={control}
                        name="policyId"
                      />
                    </Field>
                  </FieldSet>
                )
              }}
            </Form>
            <hr />
            <FormAttributes attributes={attributes} setAttributes={setAttributes} disabled={false}/>
            <hr />
            <FormFeatures features={features} setFeatures={setFeatures} disabled={false}/>
            <div className="d-flex justify-content-center">
              <Button className="mt-3" type="submit" form="formTypeFinal">Create</Button>
            </div>
          </div>
          <div className="col-4">
            <Field label="Preview">
              <TextArea value={JSON.stringify(currentType, undefined, 4)} rows={25} /*className="w-100 h-100 mb-4" style={{boxSizing: "border-box"}}*/ readOnly/>
            </Field>
          </div>
        </div>
      </Fragment>
    )
}