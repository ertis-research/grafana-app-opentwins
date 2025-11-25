import { SelectableValue } from "@grafana/data"

export interface ConnectionData {
    id: string,
    initStatus: boolean
    uri: string
    hasAuth: boolean
    username?: string
    password?: string
    ssl: boolean
    sslData: SSLData
    payloadMapping: PayloadMapping[]
    sources: SourceData[]
    targets: TargetData[]
    kafkaData: KafkaData
}

export interface PayloadMapping {
    id: string,
    code: string
}

export interface SSLData {
    ca: string
    cert: string
    key: string
}

export interface CommonDataSourceTarget {
    payloadMapping?: SelectableValue<string>
    qos: SelectableValue<number>
    others: string
}

export interface SourceData extends CommonDataSourceTarget {
    addresses: string,
    authorizationContext: string
}

export interface TargetData extends CommonDataSourceTarget {
    address: string,
    topics: string,
    authorizationContext: string
    
}

export interface KafkaData {
    bootstrapServers: string, 
    saslMechanism: SelectableValue<number>
}
