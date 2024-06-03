import React, { useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { ListParentsType } from './parents'
import { useTheme2 } from '@grafana/ui'
import { ListChildrenType } from './children'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function HierarchyType({ path, id, meta }: Parameters) {

    const bgcolor = useTheme2().colors.background.secondary

    useEffect(() => {
    }, [id])

    return <div className='row'>
        <div className='col-12 col-md-6 mt-2' style={{ height: '100%'}}>
            <div className='m-0 mr-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Parents</b></h5>
                <hr />
                <ListParentsType path={path} id={id} meta={meta} />
            </div>
        </div>
        <div className='col-12 col-md-6 mt-2'>
            <div className='m-0 ml-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Children</b></h5>
                <hr />
                <ListChildrenType path={path} meta={meta} id={id} />
            </div>
        </div>
    </div>





}
