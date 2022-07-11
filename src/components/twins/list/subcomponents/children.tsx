import React, { useState, useContext, useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { IDittoThing } from "utils/interfaces/dittoThing"
import { ISelect } from "utils/interfaces/select"
import { MainList } from 'components/auxiliary/general/mainList'
import { StaticContext } from 'utils/context/staticContext'
import { deleteTwinByIdService } from 'services/twins/crud/deleteTwinByIdService'
import { getChildrenOfTwinService } from 'services/twins/children/getChildrenOfTwinService'

interface parameters {
    path : string
    id : string
    meta : AppPluginMeta<KeyValue<any>>
}

export function ListChildrenTwin({ path, id, meta } : parameters) {
    
    const [things, setThings] = useState<IDittoThing[]>([])
    const [values, setValues] = useState<ISelect[]>([])

    const context = useContext(StaticContext)

    const updateThings = () => {
        getChildrenOfTwinService(context, id).then(res => {
            console.log(res)
            res = (res.items === undefined || res.items === []) ? [] : res.items
            setThings(res)
            console.log(things)
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
        deleteTwinByIdService(context, thingId)
        updateThings()
    }

    useEffect(() => {
        updateThings()
    }, [id])

    return <MainList path={path} meta={meta} things={things} values={values} funcThings={updateThings} funcDelete={handleOnClickDelete}/>

}