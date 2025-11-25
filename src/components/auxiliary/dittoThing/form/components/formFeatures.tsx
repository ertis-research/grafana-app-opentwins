import React, { Fragment } from 'react'
import { Button, Field, Input, Form, FormAPI, List } from '@grafana/ui'
import { IFeature } from 'utils/interfaces/dittoThing';
import { ElementHeader } from 'components/auxiliary/general/elementHeader';
import { ListElement } from 'components/auxiliary/general/listElement';

interface Parameters {
    features: IFeature[]
    setFeatures: any
    disabled: boolean
}

export const FormFeatures = ({features, setFeatures, disabled}: Parameters) => {

    const featuresDescription = "Features are used to manage all data and functionality of a Thing that can be clustered in an outline technical context"

    const handleSubmitFeatures = (data: {name: string}) => {
        let item = features.some(item => item.name === data.name);
    
        if(item === false) { 
            setFeatures([
                ...features,
                {
                    name : data.name,
                    properties : {
                        value : null
                    }
                }
            ])
        } else {
          alert("ya existe");
        }
    }
    
    return (
        <Fragment>
            <ElementHeader title="Features" description={featuresDescription} isLegend={false}/>
            <div className="row">
                <div className="col-6">
                    <Form id="formFeatures" onSubmit={handleSubmitFeatures} maxWidth="none">
                    {({register, errors}: FormAPI<{name: string}>) => {
                        return (
                            <Fragment>
                                <Field label="Name of feature" disabled={disabled}>
                                    <Input {...register("name", { required : true })} type="text" disabled={disabled}/>
                                </Field>
                                <Button type="submit" variant="secondary" form="formFeatures" disabled={disabled}>Add</Button>
                            </Fragment>
                        )
                    }}
                    </Form>
                </div>
                <div className="col-6">
                    <List 
                        items={features}
                        getItemKey={item => (item.name)}
                        renderItem={item => ListElement(item.name, features, setFeatures, [{key: "name", value: item.name}], disabled)}
                    />
                </div>
            </div>
        </Fragment>
    )
}
