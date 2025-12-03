import React, { useEffect } from 'react';
import { AppEvents } from "@grafana/data";
import { useTheme2 } from '@grafana/ui';
import { getAppEvents } from '@grafana/runtime';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Services & Interfaces
import { IDittoThing, LinkData } from 'utils/interfaces/dittoThing';
import { createOrUpdateTypeToBeChildService, getChildrenOfTypeService, getParentOfTypeService, unlinkChildrenTypeById } from 'services/TypesCompositionService';
import { getAllTypesService } from 'services/TypesService';
import { HierarchyProps, ListLabels } from './TypeHierarchy.types';
import { HierarchyItems } from './HierarchyItems';


export function TypeHierarchy({ id }: HierarchyProps) {
    const theme = useTheme2();
    const appEvents = getAppEvents();

    const history = useHistory();
    const { url } = useRouteMatch();

    // Cálculo de ruta base: /a/plugin/types
    const resourceRoot = url.split('/types')[0] + '/types';

    const bgcolor = theme.colors.background.secondary;

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

    // --- Actions ---

    // Crear un hijo nuevo para ESTE tipo (id)
    const handleCreateChild = () => {
        history.push(`${resourceRoot}/${id}/new`);
    }

    // --- Services Wrappers ---

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
            console.log("Error fetching parents:", error);
            if (error.status === 404) {
                return [];
            }
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error getting the parents: " + error.data?.message || error.message],
            });
            return []
        }
    }

    const getTypes = async (): Promise<string[]> => {
        return getAllTypesService().then((res: IDittoThing[]) => {
            return res.map((t: IDittoThing) => t.thingId)
        })
    }

    const updateChild = async (elemToUpdate: string, newNum: number): Promise<any> => {
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
        // Refresh logic if ID changes
    }, [id])

    return (
        <div className='row'>
            {/* PARENTS COLUMN */}
            <div className='col-12 col-md-6 mt-2' style={{ height: '100%' }}>
                <div className='m-0 mr-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%', borderRadius: theme.shape.borderRadius() }}>
                    <h5><b>Parents</b></h5>
                    <hr />
                    <HierarchyItems  
                        id={id} 
                        labels={parentsLabels} 
                        funcGet={getParents} 
                        funcGetOptions={getTypes} 
                        funcUpdate={updateParent} 
                        funcUnlink={unlinkParent} 
                        resourceRoot={resourceRoot}
                    />
                </div>
            </div>

            {/* CHILDREN COLUMN */}
            <div className='col-12 col-md-6 mt-2'>
                <div className='m-0 ml-md-1' style={{ backgroundColor: bgcolor, padding: '30px', height: '100%', borderRadius: theme.shape.borderRadius() }}>
                    <h5><b>Children</b></h5>
                    <hr />
                    <HierarchyItems 
                        id={id} 
                        labels={childrenLabels} 
                        funcGet={getChildren} 
                        funcGetOptions={getTypes} 
                        funcUpdate={updateChild} 
                        funcUnlink={unlinkChild} 
                        resourceRoot={resourceRoot}
                        onCreate={handleCreateChild}
                    />
                </div>
            </div>
        </div>
    )
}