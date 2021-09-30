import { CheckBySelect } from 'components/general/checkBySelect'
import React, { useEffect, useState } from 'react'
import { deleteTypeService } from 'services/types/deleteTypeService'
import { getTypesService } from 'services/types/getTypesService'
import { getSelectFromDittoThingArray } from 'utils/aux_functions'
import { ISelect } from 'utils/interfaces/select'

interface parameters {
    path : string
}

export const ListTypes = ( {path} : parameters ) => {

    const [types, setTypes] = useState<ISelect[]>([])

    const updateTypes = () => {
        getTypesService().then((res) => setTypes(getSelectFromDittoThingArray(res.items)))
    }

    const handleDeleteType = (value:string) => {
        deleteTypeService(value)
        updateTypes()
    }

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        updateTypes()
    }, [])

    return (
        <CheckBySelect path={path} tab="types" name="type" values={types} deleteFunction={handleDeleteType}/>
    );
}