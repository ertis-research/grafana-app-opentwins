import { CheckBySelect } from 'components/general/checkBySelect'
import React, { useEffect, useState } from 'react'
import { getTypesService } from 'services/types/getTypesService'
import { getSelectFromDittoThingArray } from 'utils/aux_functions'
import { ISelect } from 'utils/interfaces/select'

export const ListTypes = (props:any) => {

    const [types, setTypes] = useState<ISelect[]>([])

    useEffect(() => { //https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
        getTypesService().then(res => setTypes(getSelectFromDittoThingArray(res))).catch(() => console.log("error"))
    }, [])

    return (
        <CheckBySelect path={props.path} tab="types" name="type" values={types}/>
    );
}