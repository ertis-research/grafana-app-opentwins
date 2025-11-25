// src/components/ConnectionForm/utils/payloadBuilder.ts
import { ConnectionData, PayloadMapping, SourceData, TargetData } from 'utils/interfaces/connections'
import { Protocols } from '../ConnectionForm.types'


const strToList = (s: string) => {
    return s.split(",").map((s: string) => s.trim())
}

export const buildConnectionPayload = (connection: ConnectionData, protocol: Protocols) => {
    const scheme = (connection.ssl) ? 'ssl://' : 'tcp://';
    let fullUri = connection.uri; // Por defecto es solo el host

    if (connection.hasAuth && connection.username) {
        // Si hay auth, insertamos user:pass@
        const creds = connection.password 
            ? `${connection.username}:${connection.password}` 
            : connection.username;
        fullUri = `${creds}@${connection.uri}`;
    }
    
    const finalUri = scheme + fullUri;

    let data: any = {
        name: connection.id,
        connectionType: (protocol === Protocols.KAFKA) ? 'kafka' : 'mqtt-5',
        connectionStatus: (connection.initStatus) ? 'open' : 'closed',
        failoverEnabled: true,
        uri: finalUri, // Usamos la URI reconstruida
        sources: [],
        targets: []
    }

    if (protocol === Protocols.KAFKA) {
        data['specificConfig'] = {
            bootstrapServers: connection.kafkaData.bootstrapServers,
            saslMechanism: connection.kafkaData.saslMechanism.label
        }
    }

    if (connection.ssl) {
        if (connection.sslData.ca !== undefined && connection.sslData.ca.trim() !== '') {
            data['validateCertificates'] = true
            data['ca'] = connection.sslData.ca
        }
        if (connection.sslData.cert && connection.sslData.key) {
            data['credentials'] = {
                type: 'client-cert',
                cert: connection.sslData.cert,
                key: connection.sslData.key
            }
        }
    }

    connection.sources.forEach((s: SourceData, idx: number) => {
        data.sources[idx] = {
            addresses: strToList(s.addresses),
            authorizationContext: strToList(s.authorizationContext),
            qos: s.qos.value,
            payloadMapping: [s.payloadMapping?.value],
        }
        try {
            data.sources[idx] = { ...data.sources[idx], ...JSON.parse(s.others) }
        } catch (e) { }
    })

    connection.targets.forEach((t: TargetData, idx: number) => {
        data.targets[idx] = {
            address: t.address,
            topics: strToList(t.topics),
            authorizationContext: strToList(t.authorizationContext),
            payloadMapping: [t.payloadMapping?.value]
        }
        try {
            data.targets[idx] = { ...data.targets[idx], ...JSON.parse(t.others) }
        } catch (e) { }
        if (protocol === Protocols.MQTT5) {
            data.targets[idx].qos = t.qos.value
        }
    })

    if (connection.payloadMapping.length > 0) {
        let pms = {}
        connection.payloadMapping.forEach((pm: PayloadMapping) => {
            pms = {
                ...pms,
                [pm.id]: {
                    mappingEngine: "JavaScript",
                    options: {
                        incomingScript: pm.code.replaceAll("\t", "").replaceAll("\r\n", " ").replaceAll('"', "'")
                    }
                }
            }
        })
        data['mappingDefinitions'] = pms
    }
    
    console.log("Connection Payload", data)
    return data
}
