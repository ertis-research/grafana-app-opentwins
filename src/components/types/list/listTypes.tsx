import { CheckBySelect } from 'components/general/checkBySelect'
import React, { useEffect, useState } from 'react'
import { getTypesService } from 'services/types/getTypesService'
import { getSelectFromDittoThingArray } from 'utils/aux_functions'
import { ISelect } from 'utils/interfaces/select'

interface parameters {
    path : string
}

export const ListTypes = ( {path} : parameters ) => {

    const [types, setTypes] = useState<ISelect[]>([])

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getTypesService().then((res) => setTypes(getSelectFromDittoThingArray(res.items)))
    }, [])

    return (
        <CheckBySelect path={path} tab="types" name="type" values={types}/>
    );
}