import React, { useEffect } from 'react'
import { AppEvents, AppPluginMeta, KeyValue } from "@grafana/data"
import { useTheme2 } from '@grafana/ui'
import { ListLabels, ListThingNum } from 'components/auxiliary/dittoThing/list/listThingNum'
import { IDittoThing, LinkData } from 'utils/interfaces/dittoThing'
import { createOrUpdateTypeToBeChildService, getChildrenOfTypeService, getParentOfTypeService, unlinkChildrenTypeById } from 'services/TypesCompositionService'
import { getAllTypesService } from 'services/TypesService'
import { getAppEvents } from '@grafana/runtime'

interface Parameters {
    path: string
    id: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function HierarchyType({ path, id, meta }: Parameters) {

    const bgcolor = useTheme2().colors.background.secondary
    const appEvents = getAppEvents()

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
        return getChildrenOfTypeService(id).then((res: IDittoThing[] | undefined) => {
            return (res === undefined) ? [] : res.map((t: IDittoThing) => {
                return {
                    "id": t.thingId,
                    "num": Number(t.attributes._parents[id])
                }
            })
        })
    }

    const getParents = async (): Promise<LinkData[]> => {
        try {
            const res = await getParentOfTypeService(id);

            return Object.entries(res ?? {}).map(([id, num]) => ({
                id,
                num
            }));

        } catch (error: any) {
            console.log("HOLA")
            if (error.status === 404) {
                console.log("SI")
                return [];
            }
            console.log("ADIOS")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error getting the parents: " + error.data.message],
            });
            return []
        }
    }

    const getTypes = async (): Promise<string[]> => {
        return getAllTypesService().then((res: IDittoThing[]) => {
            return res.map((t: IDittoThing) => {
                return t.thingId
            })
        })
    }

    const updateChild = async (elemToUpdate: string, newNum: number): Promise<any> => {
        console.log("elemToUpdate", elemToUpdate)
        return await createOrUpdateTypeToBeChildService(id, elemToUpdate, newNum)
    }

    const updateParent = async (elemToUpdate: string, newNum: number): Promise<any> => {
        return await createOrUpdateTypeToBeChildService(elemToUpdate, id, newNum)
    }

    const unlinkParent = async (elemToUnlink: string): Promise<any> => {
        return await unlinkChildrenTypeById(elemToUnlink, id)
    }

    const unlinkChild = async (elemToUnlink: string): Promise<any> => {
        return await unlinkChildrenTypeById(id, elemToUnlink)
    }

    useEffect(() => {
    }, [id])

    return <div className='row'>
        <div className='col-12 col-md-6 mt-2' style={{ height: '100%' }}>
            <div className='m-0 mr-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Parents</b></h5>
                <hr />
                <ListThingNum path={path} meta={meta} id={id} labels={parentsLabels} isType={true} funcGet={getParents} funcGetOptions={getTypes} funcUpdate={updateParent} funcUnlink={unlinkParent} />
            </div>
        </div>
        <div className='col-12 col-md-6 mt-2'>
            <div className='m-0 ml-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%' }}>
                <h5><b>Children</b></h5>
                <hr />
                <ListThingNum path={path} meta={meta} id={id} labels={childrenLabels} isType={true} funcGet={getChildren} funcGetOptions={getTypes} funcUpdate={updateChild} funcUnlink={unlinkChild} hrefCreateButton={path + '&mode=create' + ((id !== undefined) ? '&id=' + id : "")} />
            </div>
        </div>
    </div>

    //<ListChildrenType path={path} meta={meta} id={id} />

}
