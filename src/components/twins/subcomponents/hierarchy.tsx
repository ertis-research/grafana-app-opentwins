import React, { useContext, useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { useTheme2 } from '@grafana/ui'
import { ListLabels, ListThingNum } from 'components/auxiliary/dittoThing/list/listThingNum'
import { Context, StaticContext } from 'utils/context/staticContext'
import { getChildrenOfTypeService } from 'services/types/children/getChildrenOfTypeService'
import { IDittoThing, LinkData } from 'utils/interfaces/dittoThing'
import { getParentOfTwinService } from 'services/twins/parent/getParentOfTwinService'
import { getAllRootTwinsService } from 'services/twins/getAllRootTwinsService'
import { createOrUpdateTwinToBeChildService } from 'services/twins/children/createOrUpdateTwinToBeChildService'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function HierarchyType({ path, id, meta }: Parameters) {

    const bgcolor = useTheme2().colors.background.secondary
    const context = useContext(StaticContext)

    const childrenLabels: ListLabels = {
        id: "Child",
        number: "Number",
        buttonsText: "child"
    }

    const getChildren = async (): Promise<LinkData[]> => {
        return getChildrenOfTypeService(context, id).then((res: IDittoThing[]|undefined) => {
            return (res === undefined) ? [] : res.map((t: IDittoThing) => { 
                return {
                    "id": t.thingId, 
                    "num": Number(t.attributes._parents[id])
                }
            })
        })
    }

    const getParent = async (): Promise<LinkData> => {
        return getParentOfTwinService(context, id).then((res: {[id: string]: number}|undefined) => {
            return (res === undefined) ? [] : Object.entries(res).map(([id, num]) => {
                return {
                    "id": id,
                    "num": num
                }
            })
        })
    }

    const getTypes = async (): Promise<string[]> => {
        return getAllRootTwinsService(context).then((res: IDittoThing[]) => {
            return res.map((t: IDittoThing) => { 
                return t.thingId
            })
        })
    }

    const updateChild = async (elemToUpdate: string): Promise<any> => {
        console.log("elemToUpdate", elemToUpdate)
        return createOrUpdateTwinToBeChildService(context, id, elemToUpdate)
    }

    const unlinkChild = async (elemToUnlink: string): Promise<any> => {
        return unlinkChildrenTwinById(context, id, elemToUnlink)
    }
    
    useEffect(() => {
    }, [id])

    return <div className='row'>
        <div className='col-12 col-md-6 mt-2' style={{ height: '100%'}}>
            <div className='m-0 mr-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Parents</b></h5>
                <hr />
            </div>
        </div>
        <div className='col-12 col-md-6 mt-2'>
            <div className='m-0 ml-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Children</b></h5>
                <hr />
                <ListThingNum path={path} meta={meta} id={id} labels={childrenLabels} isType={false} funcGet={getChildren} funcGetOptions={getTypes} funcUpdate={updateChild} funcUnlink={unlinkChild} hrefCreateButton={path + '&mode=create' + ((id !== undefined) ? '&id=' + id : "")}/>
            </div>
        </div>
    </div>

//<ListChildrenType path={path} meta={meta} id={id} />

}
function unlinkChildrenTwinById(context: Context, id: string, elemToUnlink: string): any {
    throw new Error('Function not implemented.')
}

