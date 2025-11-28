import React, { useState, useEffect, Fragment, ChangeEvent } from 'react';
import { AppEvents, SelectableValue } from "@grafana/data";
import { useTheme2, Icon, Input, Button, Form, FormAPI, Select, InlineLabel } from '@grafana/ui';
import { getAppEvents } from '@grafana/runtime';
import { useHistory, useRouteMatch } from 'react-router-dom';

// Services & Interfaces
import { IDittoThing, LinkData } from 'utils/interfaces/dittoThing';
import { createOrUpdateTypeToBeChildService, getChildrenOfTypeService, getParentOfTypeService, unlinkChildrenTypeById } from 'services/TypesCompositionService';
import { getAllTypesService } from 'services/TypesService';
import { enumNotification } from 'utils/auxFunctions/general';
import { SelectData } from 'utils/interfaces/select';

// --- Interfaces ---

interface HierarchyProps {
    id: string
}

interface ListLabels {
    id: string,
    number: string,
    buttonsText: string
}

interface ListThingNumProps {
    id: string; 
    labels: ListLabels;
    funcGet: () => Promise<LinkData[]>;
    funcUpdate: (elemToUpdate: string, newNum: number) => Promise<any>;
    funcUnlink: (elemToUnlink: string) => Promise<any>;
    funcGetOptions: () => Promise<string[]>;
    resourceRoot: string; // Ruta base limpia (/a/plugin/types)
    onCreate?: () => void; // OPCIONAL: Si no se pasa, no se muestra el botón
}

// =============================================================================
// SUB-COMPONENT: ListThingNum (La lista de padres/hijos)
// =============================================================================

function ListTypesNum({ id, labels, funcGet, funcUpdate, funcUnlink, funcGetOptions, resourceRoot, onCreate }: ListThingNumProps) {
    const history = useHistory();
    const theme = useTheme2();
    const appEvents = getAppEvents();

    const [things, setThings] = useState<LinkData[]>([])
    const [filteredThings, setFilteredThings] = useState<LinkData[]>([])
    const [value, setValue] = useState<string>()
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [selected, setSelected] = useState<SelectableValue<string>>()
    const [options, setOptions] = useState<SelectData[]>([])
    const [newLink, setNewLink] = useState<LinkData>({ id: '', num: 1 })

    const cleanNewThing = () => {
        setSelected({ value: '', label: '' })
        setNewLink({ id: '', num: 1 })
    }

    const getOptions = () => {
        funcGetOptions().then((res) => setOptions(
            res.filter((item: string) => item !== id && !(things.some(v => v.id === item)))
                .map((item: string) => ({ label: item, value: item }))
        )).catch(() => console.log("error"))
    }

    const handleUnlink = (elemToUnlink: string) => {
        setShowNotification(enumNotification.LOADING)
        funcUnlink(elemToUnlink).then(() => {
            console.log("OK")
            setTimeout(getThings, 1500)
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`${elemToUnlink} has been unlinked correctly`],
            });
        }).catch(() => {
            console.log("error")
            getThings()
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`${elemToUnlink} has not been unlinked correctly`],
            });
        })
    }

    const getThings = () => {
        funcGet().then((res: LinkData[]) => {
            setThings(res)
        }).catch(() => {
            console.log("error")
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`Error getting things`],
            });
        }).finally(() => setShowNotification(enumNotification.READY))
    }

    const updateFilteredThings = () => {
        const filterThings = (things !== undefined) ? things.sort((a: LinkData, b: LinkData) => a.id.localeCompare(b.id)) : things
        if (value === null || value === undefined) {
            setFilteredThings(filterThings)
        } else {
            setFilteredThings(filterThings.filter(thing => { return (value !== undefined) ? thing.id.includes(value) : true }))
        }
    }

    const handleOnSubmit = (data: LinkData) => {
        console.log("submit data", data)
        setShowNotification(enumNotification.LOADING)
        funcUpdate(data.id, Number(data.num)).then(() => {
            console.log("OK")
            setTimeout(getThings, 1000)
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`${id} has been edited correctly`],
            });
        }).catch(() => {
            getThings()
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: [`${id} has not been edited correctly, please check the data you have entered`],
            });
        })
    }

    const handleOnChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnChangeInputNum = (event: React.FormEvent<HTMLInputElement>, thing: string) => {
        let newThings = JSON.parse(JSON.stringify(things))
        const idx: number = newThings.findIndex((v: LinkData) => v.id === thing)
        newThings[idx] = {
            id: thing,
            num: event.currentTarget.value
        }
        setThings(newThings)
    }

    const handleGoToDetails = (targetId: string) => {
        history.push(`${resourceRoot}/${targetId}`);
    }

    useEffect(() => {
        getThings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        updateFilteredThings()
        getOptions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [things, value])

    useEffect(() => {
        if (selected === undefined) {
            setNewLink({ id: '', num: 1 })
        } else {
            setNewLink({
                ...newLink,
                id: (selected && selected.value) ? selected.value : ''
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    const childrenMapped = filteredThings.map((thing: LinkData) => {
        const pid = thing.id.replace(":", "_")
        return <Form id={"form_" + pid} onSubmit={handleOnSubmit} maxWidth="none" style={{ marginTop: '0px', paddingTop: '0px' }} key={thing.id}>
            {({ register }: FormAPI<LinkData>) => (
                <div className='row mt-2'>
                    <div className="col-12 col-xl-5 mt-1">
                        <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                            <InlineLabel style={{ width: '80px', backgroundColor: theme.colors.secondary.main }}>{labels.id}</InlineLabel>
                            <Input {...register("id")} id={"input_id_" + pid} value={thing.id} readOnly={true} />
                        </div>
                    </div>
                    <div className="col-12 col-xl-3 mt-1">
                        <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                            <InlineLabel style={{ width: '80px', backgroundColor: theme.colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>{labels.number}</InlineLabel>
                            <Input {...register("num")} id={"input_num_" + pid} type="text" value={thing.num} onChange={(e) => handleOnChangeInputNum(e, thing.id)} disabled={showNotification === enumNotification.LOADING} />
                        </div>
                    </div>
                    <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type='submit' variant='secondary' style={{ marginRight: '5px', width: '100%', justifyContent: 'center' }} disabled={showNotification === enumNotification.LOADING}>Update</Button>
                        <Button type='button' variant='destructive' style={{ marginRight: '5px' }} onClick={() => handleUnlink(thing.id)} disabled={showNotification === enumNotification.LOADING}>Unlink</Button>
                        
                        <Button 
                            type='button' 
                            variant='secondary' 
                            icon='external-link-alt' 
                            onClick={() => handleGoToDetails(thing.id)} 
                            disabled={showNotification === enumNotification.LOADING}
                            tooltip="Go to details"
                        />
                    </div>
                </div>
            )}
        </Form>
    })

    const newChildForm = <div className='row mt-3'>
        <div className="col-12 col-xl-5 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: theme.colors.secondary.main }}>{labels.id}</InlineLabel>
                <Select
                    options={options}
                    value={selected}
                    onChange={(v) => setSelected(v)}
                    disabled={showNotification === enumNotification.LOADING}
                />
            </div>
        </div>
        <div className="col-12 col-xl-3 mt-1">
            <div style={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                <InlineLabel style={{ width: '80px', backgroundColor: theme.colors.secondary.main, overflow: 'hidden', lineHeight: '1em' }}>{labels.number}</InlineLabel>
                <Input type="number" value={newLink.num} onChange={(v) => setNewLink({ ...newLink, num: Number(v.currentTarget.value) })} disabled={showNotification === enumNotification.LOADING} />
            </div>
        </div>
        <div className="col-12 col-xl-4 mt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='button' fullWidth onClick={() => { handleOnSubmit(newLink); cleanNewThing() }} disabled={showNotification === enumNotification.LOADING || selected === undefined || (selected.value !== undefined && selected.value.trim()) === ''}>Add {labels.buttonsText}</Button>
        </div>
    </div>

    const noChildren = (things.length < 1) ?
        <h5 style={{ textAlign: 'center', marginTop: '20px' }}>There are no items</h5> : <div></div>;

    return (
        <Fragment>
            <div className="searchAndButton">
                <div style={{ width: '100%', marginRight: '5px' }}>
                    <Input
                        value={value}
                        prefix={<Icon name="search" />}
                        onChange={handleOnChangeSearch}
                        placeholder="Search"
                    />
                </div>
                {onCreate && (
                    <Button icon="plus" variant="primary" onClick={onCreate}>
                        Create New
                    </Button>
                )}
            </div>
            {newChildForm}
            <div className="row">
                {(filteredThings.length > 0) ? childrenMapped : noChildren}
            </div>
        </Fragment>
    );
}

// =============================================================================
// MAIN COMPONENT: HierarchyType
// =============================================================================

export function HierarchyType({ id }: HierarchyProps) {
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
                    <ListTypesNum  
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
                    <ListTypesNum 
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