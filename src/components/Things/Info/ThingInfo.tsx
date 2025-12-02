import React from 'react'
import { AppPluginMeta, KeyValue } from '@grafana/data'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { capitalize, defaultIfNoExist } from 'utils/auxFunctions/general'
import { basicAttributesConst } from 'utils/data/consts'
import { useTheme2 } from '@grafana/ui'

interface Parameters {
    path: string
    thingInfo: IDittoThing
    meta: AppPluginMeta<KeyValue<any>>
    isType: boolean
}

export function ThingInfo({ path, thingInfo, meta, isType }: Parameters) {

    const tab = '\u00A0\u00A0\u00A0'
    const bgcolor = useTheme2().colors.background.primary

    const arrayToJSXElement = (array: any, str = "", isCapitalize = true) => {
        return array.map((item: any, index: number) => {
            if (Array.isArray(item)) {
                return arrayToJSXElement(item, str, isCapitalize)
            } else if (item.constructor === String || item.constructor === Number || item.constructor === Boolean) {
                const className = (index !== array.length - 1) ? "mb-0" : ""
                return <p className={className}>{str + item}</p>
            } else {
                return objectToJSXElement(item, str, isCapitalize)
            }
        })
    }

    const objectToJSXElement = (object: any, str = "", isCapitalize = true) => {
        if (object !== undefined && object != null && Object.keys(object).length > 0) {
            const keys = Object.keys(object)
            return keys.map((key: string, index: number) => {
                const value = object[key]
                if (isCapitalize) { key = capitalize(key) }
                if (Array.isArray(value)) {
                    return (
                        <div>
                            <h6 className='mb-0'>{str + key}</h6>
                            <span>{arrayToJSXElement(value, str + tab, isCapitalize)}</span>
                        </div>
                    )
                } else if (value === null || value === undefined || value.constructor === String || value.constructor === Number || value.constructor === Boolean) {
                    const className = (index !== keys.length - 1 && str !== "") ? "mb-0" : ""
                    return (
                        <div>
                            <h6 className='mb-0'>{str + key}</h6>
                            <p className={className}>{str}{(value != null && value !== undefined) ? value : "No data"}</p>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <h6 className='mb-0'>{str + key}</h6>
                            <span>{objectToJSXElement(value, str + tab, isCapitalize)}</span>
                        </div>
                    )
                }
            })
        }
        return <div></div>
    }

    const attributes = () => {
        let thingAttributes = Object.assign({}, defaultIfNoExist(thingInfo, "attributes", {}))
        for (let key in thingAttributes) {
            if (thingAttributes.hasOwnProperty(key) && (key.startsWith("_") || basicAttributesConst.includes(key))) {
                delete thingAttributes[key]
            }
        }
        return objectToJSXElement(thingAttributes)
    }

    const features = () => {
        return objectToJSXElement(Object.assign({}, defaultIfNoExist(thingInfo, "features", {})), "", false)
    }

    const attributeIfExist = (object: any, nameAttribute: string) => {
        if (defaultIfNoExist(object, nameAttribute, undefined) !== undefined) {
            return (
                <div>
                    <h6 className='mb-0'>{capitalize(nameAttribute)}</h6>
                    <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{object[nameAttribute]}</p>
                </div>
            )
        } else {
            return <div></div>
        }
    }

    return (
        <div className="row">
            <div className="col-0 col-xl-2"></div>
            <div className="col-12 col-md-6 col-xl-4 mt-2">
                <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px', height: '100%' }}>
                    <h5><b>Static data</b></h5>
                    <hr />
                    {attributeIfExist(thingInfo.attributes, "name")}
                    {attributeIfExist(thingInfo, "policyId")}
                    {attributeIfExist(thingInfo.attributes, "description")}
                    {attributes()}
                </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4 mt-2">
                <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px', height: '100%' }}>
                    <h5><b>Dynamic data</b></h5>
                    <hr />
                    {features()}
                </div>
            </div>
            <div className="col-0 col-xl-2"></div>
        </div >
    )
}
