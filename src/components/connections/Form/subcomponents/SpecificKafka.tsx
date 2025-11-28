// src/components/ConnectionForm/components/FormSections/SpecificKafka.tsx
import React, { FormEvent } from 'react'
import { Field, Input, Select } from '@grafana/ui'
import { SelectableValue } from '@grafana/data'
import { KafkaData } from 'utils/interfaces/connections'
import { keys, SSALMechanismOptions } from '../utils/constants'

interface Props {
    kafkaData: KafkaData
    onInputChange: (event: FormEvent<HTMLInputElement>, key: string) => void
    onSelectChange: (e: SelectableValue<any>, key: string, name: string) => void
}

export const SpecificKafka: React.FC<Props> = ({ kafkaData, onInputChange, onSelectChange }) => {
    return (
        <div>
            <Field label="Bootstraps servers" required={true} description="Contains a comma separated list of Kafka bootstrap servers to use for connecting to (in addition to the still required connection uri)">
                <Input 
                    name='bootstrapServers' 
                    required={true} 
                    type="text" 
                    value={kafkaData.bootstrapServers} 
                    onChange={(e) => onInputChange(e, keys.kafkaData)} 
                />
            </Field>
            <Field label="SASL mechanism" required={true} description="Required if connection uri contains username/password. Choose one of the following SASL mechanisms to use for authentication at Kafka">
                <Select 
                    options={SSALMechanismOptions} 
                    value={kafkaData.saslMechanism} 
                    onChange={(e) => onSelectChange(e, keys.kafkaData, keys.saslMechanism)} 
                />
            </Field>
        </div>
    )
}
