import React from 'react';
import { Button, Field, Input, Select, Switch } from '@grafana/ui';
import { useForm, Controller } from 'react-hook-form';
import { SelectData } from 'utils/interfaces/select';
import { enumToISelectList } from 'utils/auxFunctions/general';
import { TypesOfField } from 'utils/data/consts';
import { ContentFieldFormData } from '../SimulationForm.types';

interface Props {
    onAdd: (data: ContentFieldFormData) => void;
    disabled: boolean;
}

export const ContentFieldForm = ({ onAdd, disabled }: Props) => {
    // Inicializamos useForm.
    const { register, control, handleSubmit, reset } = useForm<ContentFieldFormData>();
    const typesOfFieldList: SelectData[] = enumToISelectList(TypesOfField);

    const onSubmit = (data: ContentFieldFormData) => {
        onAdd(data);
        reset({ name: '', default: '', required: false, typeSelect: undefined });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Name: Input simple con register (Funciona bien siempre) */}
                <Field label="Name" required style={{ flex: 1, minWidth: '150px' }}>
                    <Input
                        {...register("name", { required: true })}
                        disabled={disabled}
                        placeholder="param_name"
                    />
                </Field>

                {/* Type: Usamos Controller directamente en lugar de InputControl para evitar el bug de Refs */}
                <Field label="Type" required style={{ flex: 1, minWidth: '150px' }}>
                    <Controller
                        name="typeSelect"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                options={typesOfFieldList}
                                value={value}
                                onChange={onChange}
                                disabled={disabled}
                                placeholder="Select type"
                            // No pasamos 'ref' aquí al Select de Grafana para evitar el crash
                            />
                        )}
                    />
                </Field>

                <Field label="Default Value" style={{ flex: 1, minWidth: '150px' }}>
                    <Input
                        {...register("default")}
                        disabled={disabled}
                        placeholder="Optional"
                    />
                </Field>

                <Field label="Req." description="Required?">
                    <Switch
                        {...register("required")}
                        disabled={disabled}
                    />
                </Field>

                <div style={{ paddingTop: '22px' }}>
                    <Button type="submit" variant="secondary" disabled={disabled} icon="plus">
                        Add
                    </Button>
                </div>
            </div>
        </form>
    );
};
