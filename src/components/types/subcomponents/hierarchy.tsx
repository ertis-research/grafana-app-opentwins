import React, { useContext, useEffect } from 'react'
import { AppPluginMeta, KeyValue } from "@grafana/data"
import { useTheme2 } from '@grafana/ui'
import { ListLabels, ListThingNum } from 'components/auxiliary/dittoThing/list/listThingNum'
import { getAllTypesService } from 'services/types/getAllTypesService'
import { StaticContext } from 'utils/context/staticContext'
import { getChildrenOfTypeService } from 'services/types/children/getChildrenOfTypeService'
import { IDittoThing, LinkData } from 'utils/interfaces/dittoThing'
import { getParentOfTypeService } from 'services/types/parent/getParentTypeService'
import { createOrUpdateTypeToBeChildService } from 'services/types/children/createOrUpdateTypeToBeChildService'
import { unlinkChildrenTypeById } from 'services/types/children/unlinkChildrenTypeByIdService'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function HierarchyType({ path, id, meta }: Parameters) {

    const bgcolor = useTheme2().colors.background.secondary
    const context = useContext(StaticContext)

    const parentsLabels: ListLabels = {
        id: "Parent",
        number: "Children number",
        buttonsText: "parent"
    }

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

    const getParents = async (): Promise<LinkData[]> => {
        return getParentOfTypeService(context, id).then((res: {[id: string]: number}|undefined) => {
            return (res === undefined) ? [] : Object.entries(res).map(([id, num]) => {
                return {
                    "id": id,
                    "num": num
                }
            })
        })
    }

    const getTypes = async (): Promise<string[]> => {
        return getAllTypesService(context).then((res: IDittoThing[]) => {
            return res.map((t: IDittoThing) => { 
                return t.thingId
            })
        })
    }

    const updateChild = async (elemToUpdate: string, newNum: number): Promise<any> => {
        console.log("elemToUpdate", elemToUpdate)
        return createOrUpdateTypeToBeChildService(context, id, elemToUpdate, newNum)
    }

    const updateParent = async (elemToUpdate: string, newNum: number): Promise<any> => {
        return createOrUpdateTypeToBeChildService(context, elemToUpdate, id, newNum)
    }

    const unlinkParent = async (elemToUnlink: string): Promise<any> => {
        return unlinkChildrenTypeById(context, elemToUnlink, id)
    }

    const unlinkChild = async (elemToUnlink: string): Promise<any> => {
        return unlinkChildrenTypeById(context, id, elemToUnlink)
    }
    
    useEffect(() => {
    }, [id])

    return <div className='row'>
        <div className='col-12 col-md-6 mt-2' style={{ height: '100%'}}>
            <div className='m-0 mr-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Parents</b></h5>
                <hr />
                <ListThingNum path={path} meta={meta} id={id} labels={parentsLabels} isType={true} funcGet={getParents} funcGetOptions={getTypes} funcUpdate={updateParent} funcUnlink={unlinkParent}/>
            </div>
        </div>
        <div className='col-12 col-md-6 mt-2'>
            <div className='m-0 ml-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Children</b></h5>
                <hr />
                <ListThingNum path={path} meta={meta} id={id} labels={childrenLabels} isType={true} funcGet={getChildren} funcGetOptions={getTypes} funcUpdate={updateChild} funcUnlink={unlinkChild} hrefCreateButton={path + '&mode=create' + ((id !== undefined) ? '&id=' + id : "")}/>
            </div>
        </div>
    </div>

//<ListChildrenType path={path} meta={meta} id={id} />

}
