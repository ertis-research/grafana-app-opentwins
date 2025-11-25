// src/components/ConnectionForm/utils/constants.ts
import { ConnectionData, SourceData, TargetData, KafkaData, PayloadMapping, SSLData } from 'utils/interfaces/connections'
import defaultOtherConnection from '../../../../utils/default/defaultOtherConnection.json'
import { Protocols } from '../ConnectionForm.types'
import { SelectData } from 'utils/interfaces/select'

// Textos y Mensajes
export const InvalidMsg = "Blank spaces and uppercase letters are not allowed"
export const initMapper = "function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {\r\n\tconst jsonData = JSON.parse(textPayload);\r\n\tconst namespace = 'test';\r\n\tconst name = jsonData.id;\r\n\tconst value = jsonData.value;\r\n\theaders = Object.assign(headers, { 'Content-Type': 'application/merge-patch+json' });\r\n\r\n\tconst feature = {\r\n\t\thumidity: {\r\n\t\t\tproperties: {\r\n\t\t\t\tvalue: value\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\t\r\n\treturn Ditto.buildDittoProtocolMsg(\r\n\t\tnamespace,\r\n\t\tname,\r\n\t\t'things',\r\n\t\t'twin',\r\n\t\t'commands',\r\n\t\t'merge',\r\n\t\t'/features',\r\n\t\theaders,\r\n\t\tfeature\r\n\t);\r\n}"
export const requirementsMapper = "The mapping function must always have the name mapToDittoProtocolMsg and the specified parameters. In addition, it must return an object or a list of objects built with Ditto.buildDittoProtocolMsg. It uses the Rhino JavaScript engine, double quotes are not allowed and semicolons are mandatory."
export const rememberPayload = "If you have defined a custom Payload Mapping, please ensure you select its ID below."
export const descriptionExample = 'The code shown is an example for a mapper that updates the “humidity” feature for digital twins of the namespace "test". For example, a message { "id": "twin", "value": 5 } would update the “humidity” feature of the digital twin test:twin to 2.'

// Opciones de Selectores
export const ProtocolOptions = [
    { label: Protocols.MQTT5, value: Protocols.MQTT5 },
    { label: Protocols.KAFKA, value: Protocols.KAFKA },
    { label: Protocols.OTHERS, value: Protocols.OTHERS },
]
export const SSALMechanismOptions: SelectData[] = [{ label: 'plain', value: 0 }, { label: 'scram-sha-256', value: 1 }, { label: 'scram-sha-512', value: 2 }]
export const initQoS = { label: '1', value: 1 }
export const initMapping = { label: 'Ditto protocol', value: 'Ditto' }

// Estados Iniciales
export const initJSmapping: PayloadMapping = { id: "", code: initMapper }
export const initSource: SourceData = { addresses: '', authorizationContext: 'nginx:ditto', qos: initQoS, payloadMapping: initMapping, others: '' }
export const initTarget: TargetData = { address: '', topics: "_/_/things/twin/events,_/_/things/live/messages", authorizationContext: 'nginx:ditto', qos: initQoS, payloadMapping: initMapping, others: '' }
export const initKafkaData: KafkaData = { bootstrapServers: '', saslMechanism: { label: 'plain', value: 0 } }
export const initSSLData: SSLData = { ca: '', cert: '', key: '' }
export const initConnectionData: ConnectionData = { id: '', uri: '', ssl: false, hasAuth: false, initStatus: true, payloadMapping: [], sources: [], targets: [], kafkaData: initKafkaData, sslData: initSSLData }

// Claves de estado
export const keys = {
    id: 'id', uri: 'uri', ssl: 'ssl', initStatus: 'initStatus', payloadMapping: 'payloadMapping', sources: 'sources', targets: 'targets',
    kafkaData: 'kafkaData', sslData: 'sslData', others: 'others', qos: 'qos', saslMechanism: 'saslMechanism', ca: 'ca', cert: 'cert', key: 'key'
}

export { defaultOtherConnection }
