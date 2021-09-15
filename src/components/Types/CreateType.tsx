import React, { Fragment, FormEvent, useState } from 'react';
import {
  Button,
  Field,
  TextArea,
  //FormAPI,
  //HorizontalGroup,
  //InfoBox,
  Input,
  //InputControl,
  //Select,
  //stylesFactory,
  //Switch,
  //useTheme,
} from '@grafana/ui';
import {} from '@emotion/core'; //https://github.com/grafana/grafana/issues/26512

export function CreateType() {

    interface IAttributes {
      key: string;
      value: string;
    }

    const [attributes, setAttributes] = useState<IAttributes[]>([])
    const [features, setFeatures] = useState<string[]>([])
    const [readOnly, setReadOnly] = useState(true)

   /*
    const handleFinalSubmit = (event:FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      alert("enviado\nAttributos: " + attributes + "\nFeatures: " + features);
    }*/
  
    const handleSubmitAttributes = (event:FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as typeof event.target & {
        key: { value: string };
        value_: { value: string };
      };
      var newKey = target.key.value;
      var newValue = target.value_.value;
      var item = attributes.find(item => item.key == newKey);

      if(item === undefined){
        setAttributes([
          ...attributes,
          {
            key: newKey,
            value: newValue
          }
        ])
      } else {
        var index = attributes.indexOf(item);
        if(index !== -1) {
          var copy = attributes;
          item.value = newValue; 
          copy[index] = item;
          setAttributes(copy);
          alert("change");
        }
      }
      console.log(attributes)
    }

    const handleSubmitFeatures = (event:FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as typeof event.target & {
        key: { value: string };
      };
      var newKey = target.key.value;
      var item = features.some(item => item == newKey);

      if(item === false) { 
        setFeatures([
          ...features,
          newKey
        ])
      } else {
        alert("ya existe");
      }
    }

    const editPreviewOnClick = () => {
      setReadOnly(!readOnly)
    }
/*
    const handleInputChangeAttributes = (event:ChangeEvent<HTMLInputElement>) => {
      setAttributes({
        ...attributes,
        [event.currentTarget.name] : event.currentTarget.value
      })
    }*/

    const text = "attributes: {\n" + attributes.map((property) => "\t" + property.key + " : " + property.value).join(',\n') + "\n"
      + "},\nfeatures: {\n" + features.map((property) => "\t" + property + ' : {\n\t\tproperties: {\n\t\t\tvalue: null\n\t\t}\n\t}').join(',\n') + "\n}";

    return (
      <Fragment>
        <div className="row">
          <div className="col-4">
            <TextArea value={text} rows={18} cols={5} readOnly={readOnly}/>
            <Button variant="secondary" onClick={editPreviewOnClick}>Edit</Button>
          </div>
          <div className="col-8">
            <h2>Create new type</h2>
            <Field label="Name:">
              <Input name="name" type="text" placeholder="Name"/>
            </Field>
            <form onSubmit={handleSubmitAttributes}>
              <h4 className="mt-3">Add a new attribute:</h4>
              <div className="row">
                <div className="col-6">
                  <Field label="Name:">
                    <Input name="key" type="text" placeholder="Name"/>
                  </Field>
                </div>
                <div className="col-6">
                  <Field label="Value:">
                    <Input name="value_" type="text" placeholder="Value"/>
                  </Field>
                </div>
              </div>
              <Button type="submit" variant="secondary" >Add attribute</Button>
            </form>
            <form onSubmit={handleSubmitFeatures}>
              <h4 className="mt-3">Add a new feature:</h4>
              <Field label="Name:">
                <Input name="key" type="text" placeholder="Name"/>
              </Field>
              <Button type="submit" variant="secondary">Add feature</Button>
            </form>
            <div className="d-flex justify-content-center">
              <Button className="mt-3">Create type</Button>
            </div>
          </div>
        </div>
        
      </Fragment>
    );
  };