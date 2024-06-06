export interface ConnectionData {
    id: string,
    initStatus: boolean
    uri: string
    payloadMapping: PayloadMapping[],
    sources: DataSource[]
    targets: DataTarget[]
    kafkaData?: KafkaData
}

export interface PayloadMapping {
    id: string,
    code: string
}

export interface DataSource {
    addresses: string,
    authorizationContext: string
    qos: 0|1|2
    payloadMapping?: PayloadMapping
    others: any
}

export interface DataTarget {
    address: string,
    topics: string,
    authorizationContext: string
    qos: 0|1|2
    payloadMapping?: PayloadMapping
    others: any
}

export interface KafkaData {
    bootstrapServers: string, 
    saslMechanism: string
}
