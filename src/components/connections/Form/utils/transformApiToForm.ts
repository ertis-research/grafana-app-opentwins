// src/components/ConnectionForm/utils/transformApiToForm.ts
import { SelectableValue } from '@grafana/data'
import { initConnectionData, initJSmapping, initKafkaData, initMapping, initQoS, SSALMechanismOptions } from './constants'
import { ConnectionData, KafkaData, PayloadMapping, SourceData, SSLData, TargetData } from 'utils/interfaces/connections'

// Helper para revertir strToList
const listToStr = (list: string[] | undefined): string => {
    return (list || []).join(', ')
}

// Helper para encontrar el objeto SelectData correcto
const findQoS = (val: number | undefined): SelectableValue<number> => {
    if (val === undefined || val < 0 || val > 2) { return initQoS; }
    return { label: val.toString(), value: val };
}

const findSasl = (label: string | undefined): SelectableValue<number> => {
    return SSALMechanismOptions.find(opt => opt.label === label) || SSALMechanismOptions[0];
}

// Helper para "otros"
const extractOthers = (obj: any, keysToExclude: string[]): string => {
    const others: any = {};
    for (const key in obj) {
        if (!keysToExclude.includes(key)) {
            others[key] = obj[key];
        }
    }
    return Object.keys(others).length > 0 ? JSON.stringify(others, null, 2) : '';
}

export const transformApiDataToFormState = (apiData: any): ConnectionData => {
    if (!apiData) { return initConnectionData; }

    // Mapea las definiciones de mappers primero
    const payloadMapping: PayloadMapping[] = apiData.mappingDefinitions 
        ? Object.keys(apiData.mappingDefinitions).map(key => ({
            id: key,
            code: apiData.mappingDefinitions[key]?.options?.incomingScript || initJSmapping.code // Asume JS
        }))
        : [];
    
    // Helper para encontrar el SelectData del mapper
    const findMapping = (id: string | undefined): SelectableValue<string> => {
        if (id === 'Ditto' || !id) { return initMapping; }
        const found = payloadMapping.find(pm => pm.id === id);
        return found ? { label: found.id, value: found.id } : initMapping;
    }

    const sources: SourceData[] = (apiData.sources || []).map((s: any) => ({
        addresses: listToStr(s.addresses),
        authorizationContext: listToStr(s.authorizationContext),
        qos: findQoS(s.qos),
        payloadMapping: findMapping(s.payloadMapping ? s.payloadMapping[0] : undefined),
        others: extractOthers(s, ['addresses', 'authorizationContext', 'qos', 'payloadMapping'])
    }));

    const targets: TargetData[] = (apiData.targets || []).map((t: any) => ({
        address: t.address || '',
        topics: listToStr(t.topics),
        authorizationContext: listToStr(t.authorizationContext),
        qos: findQoS(t.qos),
        payloadMapping: findMapping(t.payloadMapping ? t.payloadMapping[0] : undefined),
        others: extractOthers(t, ['address', 'topics', 'authorizationContext', 'qos', 'payloadMapping'])
    }));

    const kafkaData: KafkaData = apiData.specificConfig ? {
        bootstrapServers: apiData.specificConfig.bootstrapServers || '',
        saslMechanism: findSasl(apiData.specificConfig.saslMechanism)
    } : initKafkaData;

    const sslData: SSLData = {
        ca: apiData.ca || '',
        cert: apiData.credentials?.cert || '',
        key: apiData.credentials?.key || ''
    };

    return {
        id: apiData.name || '',
        uri: (apiData.uri || '').replace('tcp://', '').replace('ssl://', ''),
        ssl: (apiData.uri || '').startsWith('ssl://'),
        initStatus: (apiData.connectionStatus || 'open') === 'open',
        payloadMapping,
        sources,
        targets,
        kafkaData,
        sslData
    };
};
