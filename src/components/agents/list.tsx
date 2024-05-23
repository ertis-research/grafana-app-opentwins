import React, { ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState } from 'react'
import { AppPluginMeta, KeyValue, SelectableValue } from "@grafana/data"
import { ConfirmModal, Icon, IconButton, Input, LinkButton, Select, TextArea, useTheme2, VerticalGroup } from '@grafana/ui'
import { enumNotification } from 'utils/auxFunctions/general'
import { AgentState, ListAgent, Pod, PodState, Types_values } from 'utils/interfaces/agents'
import { getAllAgentsService } from 'services/agents/getAllAgentsService'
import { CronJobIcon, DeployIcon } from 'img/icons'
import { getAgentByIdService } from 'services/agents/getAgentByIdService'
import { StaticContext } from 'utils/context/staticContext'
import { pauseAgentByIdService } from 'services/agents/pauseAgentByIdService'
import { resumeAgentByIdService } from 'services/agents/resumeAgentByIdService'
import { deleteAgentByIdService } from 'services/agents/deleteAgentByIdService'
import cronstrue from 'cronstrue'


interface Parameters {
    path: string
    meta: AppPluginMeta<KeyValue<any>>
}

export function ListAgents({ path, meta }: Parameters) {

    const context = useContext(StaticContext)

    const [agents, setAgents] = useState<ListAgent[]>([])
    const [selectedAgent, setSelectedAgent] = useState<{ id: string, data: any } | undefined>(undefined)
    //const [values, setValues] = useState<SelectData[]>([])
    const [value, setValue] = useState<string>()
    const [type, setType] = useState<SelectableValue<string>>(Types_values[0])
    const [filteredAgents, setFilteredAgents] = useState<ListAgent[]>([])
    const [showNotification, setShowNotification] = useState<string>(enumNotification.HIDE)
    const [isOpenDelete, setIsOpenDelete] = useState<ListAgent | undefined>(undefined)

    const stringDateToLocal = (dt: string) => {
        return new Date(dt).toLocaleString()
    }

    const getColor = (item: ListAgent) => {
        if (item.status === AgentState.PAUSED) {
            return useTheme2().colors.text.secondary
        } else if (item.pods.every((pod: Pod) => (pod.phase === PodState.RUNNING && pod.status) || pod.phase === PodState.SUCCEEDED)) {
            return useTheme2().colors.success.main
        } else if (item.pods.every((pod: Pod) => pod.phase === PodState.PENDING || (pod.phase === PodState.RUNNING && pod.status) || pod.phase === PodState.SUCCEEDED)) {
            return useTheme2().colors.warning.main
        } else {
            return useTheme2().colors.error.main
        }
    }

    const getColorPod = (pod: Pod) => {
        if ((pod.phase === PodState.RUNNING && pod.status) || pod.phase === PodState.SUCCEEDED) {
            return useTheme2().colors.success.main
        } else if (pod.phase === PodState.PENDING) {
            return useTheme2().colors.warning.main
        } else {
            return useTheme2().colors.error.main
        }
    }

    const updateThings = () => {
        setShowNotification(enumNotification.LOADING)
        getAllAgentsService(context).then((res: ListAgent[]) => {
            console.log("agents", res)
            setAgents(res.sort((a: ListAgent, b: ListAgent) => a.id.localeCompare(b.id)))
            setShowNotification(enumNotification.READY)
        }).catch(() => console.log("error"))
    }

    const updateFilteredThings = () => {
        let filteredAgents: ListAgent[] = JSON.parse(JSON.stringify(agents))
        if (value !== null && value !== undefined) {
            filteredAgents = filteredAgents.filter(agent => {
                const lowerValue = value.toLowerCase()
                return agent.id.toLowerCase().includes(lowerValue)
                    || agent.name.toLowerCase().includes(lowerValue)
                    || agent.namespace.toLowerCase().includes(lowerValue)
            })
        }
        if (type.value && type.value !== 'all') {
            filteredAgents = filteredAgents.filter(agent => agent.type === type.value)
        }
        console.log(filteredAgents)
        setFilteredAgents(filteredAgents)
    }

    const handleOnChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleOnClickPausePlay = (item: ListAgent) => {
        if (item.status === AgentState.ACTIVE) {
            pauseAgentByIdService(context, item.id, item.namespace).then((res: any) => {
                console.log("pausado")
                //setShowNotification(enumNotification.READY)
                updateThings()
            }).catch(() => console.log("error"))
        } else {
            resumeAgentByIdService(context, item.id, item.namespace).then((res: any) => {
                console.log("activando")
                //setShowNotification(enumNotification.READY)
                updateThings()
            }).catch(() => console.log("error"))
        }
    }

    const handleOnConfirmDelete = (item: ListAgent) => {
        deleteAgentByIdService(context, item.id, item.namespace).then((res: any) => {
            console.log("deleteando")
            //setShowNotification(enumNotification.READY)
            updateThings()
        }).catch(() => console.log("error"))
    }

    const handleOnClickCard = (e: MouseEvent<HTMLElement>, item: ListAgent) => {
        e.preventDefault();
        if (selectedAgent?.id === item.id) {
            setSelectedAgent(undefined)
        } else {
            getAgentByIdService(context, item.id, item.namespace).then((res: any) => {
                if (res !== undefined) {
                    setSelectedAgent({ id: item.id, data: JSON.parse(res) })
                }
                setShowNotification(enumNotification.READY)
            }).catch(() => console.log("error"))
        }
    }

    useEffect(() => {
        console.log(filteredAgents)
    }, [filteredAgents])

    useEffect(() => {
        updateThings()
    }, [])

    useEffect(() => {
        updateFilteredThings()
    }, [agents, type, value])

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateThings()
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    const showPods = (item: ListAgent) => {
        const isSelected: boolean = selectedAgent !== undefined && selectedAgent.id === item.id
        return <div className='listSelected' style={{ width: '90%', height: (isSelected) ? 'auto' : '0px', transformOrigin: 'top', transform: (isSelected) ? 'scaleY(1)' : 'scaleY(0)', transition: 'transform 0.3s ease-in-out' }}>
            {
                item.pods.map((pod: Pod, idx: number) => {
                    return <div style={{ color: 'white', display: 'flex', height: '55px', borderTop: (idx !== 0) ?  ('1px solid ' + useTheme2().colors.background.primary) : '' }}>
                        <div style={{ backgroundColor: getColorPod(pod), height: '100%', padding: '5px', width: '100px', alignContent: 'center', textAlign: 'center' }}>
                            {(pod.phase === PodState.RUNNING && !pod.status) ? 'Crashed' : pod.phase}
                        </div>
                        <div style={{ height: '100%', padding: '5px', paddingLeft: '10px', alignContent: 'center', backgroundColor: useTheme2().colors.text.disabled, width: '100%' }}>
                            {pod.id}<br></br> {stringDateToLocal(pod.creation_timestamp)}
                        </div>
                    </div>
                })
            }
        </div>
    }

    const getCard = (item: ListAgent) => {
        return <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 mb-3" key={item.id}>
            <div style={{ height: '12px', width: '100%', backgroundColor: getColor(item), display: 'flex', justifyContent: 'center', alignContent: 'center', paddingRight: '15px', color: useTheme2().colors.background.primary }}></div>
            <div className={(selectedAgent !== undefined && selectedAgent.id === item.id) ? 'listSelected' : ''} style={{ display: "block", width: "100%", height: '95px', backgroundColor: useTheme2().colors.background.canvas }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
                    <a onClick={(e) => handleOnClickCard(e, item)} style={{ margin: '0px', padding: '0px', display: 'block', height: '100%' }}>
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div className='px-3' style={{ height: '100%', width: 'fit-content', justifyContent: 'center', alignContent: 'center', backgroundColor: useTheme2().colors.text.primary }}>
                                {(item.type === "deployment") ? DeployIcon(useTheme2().colors.background.primary) : CronJobIcon(useTheme2().colors.background.primary)}
                            </div>
                            <div style={{ display: 'flex', height: '100%', alignContent: 'center', alignItems: 'center', marginLeft: '20px' }}>
                                <div style={{ display: 'block', height: 'min-content' }}>
                                    <div style={{ display: 'flex', alignContent: 'center' }}>
                                        <h5 style={{ marginBottom: '0px', paddingBottom: '0px', marginTop: '0px', paddingTop: '0px' }}>{item.name}</h5>
                                        <div style={{ marginLeft: '5px', marginRight: '5px', color: useTheme2().colors.text.secondary }}>·</div>
                                        <div style={{ color: useTheme2().colors.text.secondary }}>{item.type}</div>
                                    </div>
                                    <div>{item.namespace} / {item.id}</div>
                                    <div style={{ color: useTheme2().colors.text.secondary, overflow: 'hidden' }}>
                                        <i>{item.status}{(item.type === 'cronjob') ? ' · ' + cronstrue.toString(item.schedule) : ''}</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                    <div className='buttonsFixResponsive' style={{ height: '100%', alignContent: 'center', marginLeft: '20px' }}>
                        <IconButton size='xl' style={{ paddingRight: '10px' }} name={(item.status === AgentState.ACTIVE) ? "pause" : "play"} onClick={() => handleOnClickPausePlay(item)} />
                        <IconButton size='xl' name='trash-alt' style={{ paddingRight: '10px' }} onClick={() => setIsOpenDelete(item)} />
                    </div>
                </div>
            </div>
            {showPods(item)}
        </div>
    }

    const agentsMapped = filteredAgents.map((item: ListAgent) => getCard(item))

    const selectType = <div>
        <Select
            options={Types_values}
            value={type}
            onChange={v => setType(v)}
            prefix={<Icon name="filter" />}
            onInputChange={(v, action) => {
                if (action.action === 'set-value' || action.action === 'input-change') {
                    setType({
                        label: v,
                        value: v
                    })
                }
            }
            }
            placeholder="Search"
            width={15}
        />
    </div>

    const deleteConfirmModal = () => {
        return <ConfirmModal
            isOpen={isOpenDelete !== undefined}
            title="Delete agent"
            body="Are you sure you want to delete the agent?"
            confirmText="Confirm"
            icon="exclamation-triangle"
            onConfirm={() => {
                if (isOpenDelete) {
                    handleOnConfirmDelete(isOpenDelete)
                }
            }}
            onDismiss={() => setIsOpenDelete(undefined)}
        />
    }

    const noChildren = (showNotification !== enumNotification.READY) ? <div></div> :
        <VerticalGroup align="center">
            <h5>There are no agents</h5>
        </VerticalGroup>

    return (
        <Fragment>
            {deleteConfirmModal()}
            <div className='row justify-content-between mb-3'>
                <div className='col-12 col-sm-12 col-md-3 col-lg-3'>
                    <LinkButton icon="plus" variant="primary" href={path + '&mode=create'}>
                        Create new agent
                    </LinkButton>
                </div>
                <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                    <Input
                        value={value}
                        prefix={<Icon name="search" />}
                        onChange={handleOnChangeSearch}
                        placeholder="Search"
                    />
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4" style={{ justifyContent: 'flex-end', display: 'flex' }}>
                    {selectType}
                </div>
            </div>
            <div className="row">
                <div className={'col-12 col-sm-12 ' + ((selectedAgent) ? 'col-md-7 col-lg-7' : 'col-md-12 col-lg-12')}>
                    <div className="row">
                        {(filteredAgents.length > 0) ? agentsMapped : noChildren}
                    </div>
                </div>
                <div className='col-12 col-sm-12 col-md-5 col-lg-5'>
                    <TextArea style={{  transformOrigin: 'left', transform: ((selectedAgent) ? 'scaleX(1)' : 'scaleX(0)'), transition: 'transform 0.2s ease-out' }} rows={25} value={(selectedAgent && selectedAgent.data) ? JSON.stringify(selectedAgent.data, undefined, 2) : ""} readOnly />
                </div>
            </div>
        </Fragment>
    );

}
