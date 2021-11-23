import { SelectWithTextArea } from 'components/general/selectWithTextArea'
import React, { useEffect, useState } from 'react'
import { deleteThingTypeService } from 'services/thingTypes/deleteThingTypeService'
import { getAllThingTypesService } from 'services/thingTypes/getAllThingTypesService'
import { deleteTwinTypeService } from 'services/twinTypes/deleteTwinTypeService'
import { getSelectFromThingTypeArray } from 'utils/aux_functions'
import { ISelect } from 'utils/interfaces/select'
import { IThingType, ITwinType } from 'utils/interfaces/types'
import { Legend } from '@grafana/ui'
import { getAllTwinTypesService } from 'services/twinTypes/getAllTwinTypes'

interface parameters {
    path : string
}

export const ListTypes = ( {path} : parameters ) => {

    const [thingTypes, setThingTypes] = useState<ISelect[]>([])
    const [twinTypes, setTwinTypes] = useState<ISelect[]>([])

    const updateThingTypes = () => {
        getAllThingTypesService().then((res:IThingType[]) => setThingTypes(getSelectFromThingTypeArray(res)))
    }

    const updateTwinTypes = () => {
        getAllTwinTypesService().then((res:ITwinType[]) => setTwinTypes(
            res.map((item:ITwinType) => {
                return {
                        label : item.twinTypeId,
                        value : item.twinTypeId,
                        text : JSON.stringify(item, undefined, 4)
                    }
            })
        ))
    }

    const handleDeleteThingType = (value:string) => {
        deleteThingTypeService(value)
        updateThingTypes()
    }

    const handleDeleteTwinType = (value:string) => {
        deleteTwinTypeService(value)
        updateTwinTypes()
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        updateThingTypes()
        updateTwinTypes()
    }, [])

    return (
        <div className="row">
            <div className="col-12 col-md-6">
                <Legend>Twins</Legend>
                <SelectWithTextArea path={path} tab="types&obj=twin" name="type of twin" values={twinTypes} deleteFunction={handleDeleteTwinType}/>
            </div>
            <div className="col-12 col-md-6">
                <Legend>Things</Legend>
                <SelectWithTextArea path={path} tab="types&obj=thing" name="type of thing" values={thingTypes} deleteFunction={handleDeleteThingType}/>
            </div>
        </div>
    );
}