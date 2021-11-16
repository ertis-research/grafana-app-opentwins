import { CheckBySelect } from 'components/general/checkBySelect'
import React, { useEffect, useState } from 'react'
import { deleteThingTypeService } from 'services/thingTypes/deleteThingTypeService'
import { getAllThingTypesService } from 'services/thingTypes/getAllThingTypesService'
import { getSelectFromThingTypeArray } from 'utils/aux_functions'
import { ISelect } from 'utils/interfaces/select'
import { IThingType } from 'utils/interfaces/types'

interface parameters {
    path : string
}

export const ListTypes = ( {path} : parameters ) => {

    const [types, setTypes] = useState<ISelect[]>([])

    const updateTypes = () => {
        getAllThingTypesService().then((res:IThingType[]) => setTypes(getSelectFromThingTypeArray(res)))
    }

    const handleDeleteType = (value:string) => {
        deleteThingTypeService(value)
        updateTypes()
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        updateTypes()
    }, [])

    return (
        <CheckBySelect path={path} tab="types" name="type" values={types} deleteFunction={handleDeleteType}/>
    );
}