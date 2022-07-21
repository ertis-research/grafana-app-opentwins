import React, { useState, useContext, useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { IDittoThing } from "utils/interfaces/dittoThing"
import { ISelect } from "utils/interfaces/select"
import { MainList } from 'components/auxiliary/dittoThing/list/main'
import { StaticContext } from 'utils/context/staticContext'
import { deleteTwinService } from 'services/twins/crud/deleteTwinService'
import { getChildrenOfTwinService } from 'services/twins/children/getChildrenOfTwinService'
import { deleteTwinWithChildrenService } from 'services/twins/children/deleteTwinWithChildrenService'

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

    useEffect(() => {
        updateThings()
    }, [id])

    return <MainList 
            path={path} 
            meta={meta} 
            things={things} 
            values={values} 
            isType={false} 
            funcThings={updateThings} 
            funcDelete={deleteTwinService} 
            funcDeleteChildren={deleteTwinWithChildrenService} 
            parentId={id}
        />

}