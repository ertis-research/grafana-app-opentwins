// src/components/ConnectionForm/hooks/useConnectionForm.ts
import { useState, useCallback, FormEvent, ChangeEvent, MouseEvent } from 'react'
import { SelectableValue } from '@grafana/data'
import { ConnectionData } from 'utils/interfaces/connections'
import { initConnectionData, initJSmapping, initSource, initTarget, keys } from './utils/constants'

export const useConnectionForm = (initialData: ConnectionData = initConnectionData) => {
    const [currentConnection, setCurrentConnection] = useState<ConnectionData>(initialData)

    // --- Manejadores de Estado (optimizados con useCallback) ---

    const handleOnChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget
        setCurrentConnection(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleOnChangeInputSecondLevel = useCallback((event: FormEvent<HTMLInputElement>, key: string) => {
        const { name, value } = event.currentTarget
        setCurrentConnection(prev => ({
            ...prev,
            [key]: {
                ...(prev[key as keyof ConnectionData] as any),
                [name]: value
            }
        }))
    }, [])

    const handleOnChangeSelectInList = useCallback((e: SelectableValue<any>, key: string, name: string, idx: number) => {
        setCurrentConnection(prev => {
            const newList = [...(prev[key as keyof ConnectionData] as any[])]
            newList[idx] = { ...newList[idx], [name]: e }
            return { ...prev, [key]: newList }
        })
    }, [])
    
    const handleOnChangeSelectSecondLevel = useCallback((e: SelectableValue<any>, key: string, name: string) => {
        setCurrentConnection(prev => ({
            ...prev,
            [key]: {
                ...(prev[key as keyof ConnectionData] as any),
                [name]: e
            }
        }))
    }, [])

    const handleOnChangeInputInList = useCallback((event: FormEvent<HTMLInputElement>, key: string, idx: number) => {
        const { name, value } = event.currentTarget
        setCurrentConnection(prev => {
            const newList = [...(prev[key as keyof ConnectionData] as any[])]
            newList[idx] = { ...newList[idx], [name]: value }
            return { ...prev, [key]: newList }
        })
    }, [])

    const handleOnClickAdd = useCallback((key: string, initObject: any) => {
        setCurrentConnection(prev => ({
            ...prev,
            [key]: [...(prev[key as keyof ConnectionData] as any[]), initObject]
        }))
    }, [])

    const handleOnClickRemove = useCallback((key: string, idx: number) => {
        setCurrentConnection(prev => {
            const newList = [...(prev[key as keyof ConnectionData] as any[])]
            newList.splice(idx, 1)
            return { ...prev, [key]: newList }
        })
    }, [])

    const handleOnBlurCodeEditorPM = useCallback((c: string, idx: number) => {
        setCurrentConnection(prev => {
            const newPayloadMapping = [...prev.payloadMapping]
            newPayloadMapping[idx].code = c
            return { ...prev, payloadMapping: newPayloadMapping }
        })
    }, [])

    const handleOnBlurCodeEditorOthers = useCallback((c: string, idx: number, key: string) => {
        setCurrentConnection(prev => {
            const newElement = [...(prev[key as keyof ConnectionData] as any)]
            newElement[idx][keys.others] = c
            return { ...prev, [key]: newElement }
        })
    }, [])

    const handleOnBlurCodeEditorSecondLevel = useCallback((c: string, key: string, name: string) => {
        setCurrentConnection(prev => ({
            ...prev,
            [key]: {
                ...(prev[key as keyof ConnectionData] as any),
                [name]: c
            }
        }))
    }, [])

    const handleOnChangeSwitch = useCallback((e: MouseEvent<HTMLInputElement>, key: string) => {
        const checked = (e.target as HTMLInputElement).checked
        setCurrentConnection(prev => ({ ...prev, [key]: checked }))
    }, [])

    // --- Funciones "helper" de alto nivel ---
    const handleAddMapper = useCallback(() => handleOnClickAdd(keys.payloadMapping, initJSmapping), [handleOnClickAdd]);
    const handleAddSource = useCallback(() => handleOnClickAdd(keys.sources, initSource), [handleOnClickAdd]);
    const handleAddTarget = useCallback(() => handleOnClickAdd(keys.targets, initTarget), [handleOnClickAdd]);

    return {
        currentConnection,
        setCurrentConnection, // Crucial para setear los datos en modo "Edit"
        handlers: {
            handleOnChangeInput,
            handleOnChangeInputSecondLevel,
            handleOnChangeSelectInList,
            handleOnChangeSelectSecondLevel,
            handleOnChangeInputInList,
            handleOnClickAdd,
            handleOnClickRemove,
            handleOnBlurCodeEditorPM,
            handleOnBlurCodeEditorOthers,
            handleOnBlurCodeEditorSecondLevel,
            handleOnChangeSwitch,
            handleAddMapper,
            handleAddSource,
            handleAddTarget
        }
    }
}
