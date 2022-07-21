import React, { useState, useContext } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { IDittoThing } from "utils/interfaces/dittoThing"
import { ISelect } from "utils/interfaces/select"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { StaticContext } from 'utils/context/staticContext'
import { getAllRootTypesService } from 'services/types/getAllRootTypesService'

interface parameters {
    path : string
    meta : AppPluginMeta<KeyValue<any>>
}

export function ListTypes({ path, meta } : parameters) {
    
    const [types, setTypes] = useState<IDittoThing[]>([])
    const [values, setValues] = useState<ISelect[]>([])

    const context = useContext(StaticContext)

    const updateTypes = () => {
        getAllRootTypesService(context).then(res => {
            setTypes(res)
            console.log(types)
            if(res !== undefined){
                setValues(res.map((item:IDittoThing) => {
                    return {
                        label: item.thingId,
                        value: item.thingId
                    }
                }))
            }
        }).catch(() => console.log("error"))
    }

    const handleOnClickDelete = (e:any, thingId:string) => {
        e.preventDefault()
        updateTypes()
    }

    return <MainList path={path} meta={meta} things={types} values={values} isType={true} funcThings={updateTypes} funcDelete={handleOnClickDelete}/>

}