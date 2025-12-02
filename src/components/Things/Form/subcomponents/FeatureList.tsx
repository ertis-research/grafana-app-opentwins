import React, { useState } from 'react';
import { IFeature } from 'utils/interfaces/dittoThing';
import { Button, Input, IconButton, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

interface Props {
    features: IFeature[];
    setFeatures: (features: IFeature[]) => void;
    disabled: boolean;
}

export const FeatureList = ({ features, setFeatures, disabled }: Props) => {
    const styles = useStyles2(getStyles);
    const [name, setName] = useState('');

    const handleAdd = () => {
        if (!name) return;
        if (features.some(f => f.name === name)) return; // Evitar duplicados
        setFeatures([...features, { name, properties: { value: null } }]);
        setName('');
    };

    const handleDelete = (featureName: string) => {
        setFeatures(features.filter(f => f.name !== featureName));
    };

    return (
        <div className={styles.container}>
            {!disabled && (
                <div className={styles.inputRow}>
                    <div className={styles.fieldGrow}>
                        <Input 
                            placeholder="Feature Name (e.g. spotlight)" 
                            value={name} 
                            onChange={e => setName(e.currentTarget.value)}
                        />
                    </div>
                    <Button variant="secondary" onClick={handleAdd} icon="plus">Add</Button>
                </div>
            )}

            <div className={styles.list}>
                {features.length === 0 && <div className={styles.empty}>No features added.</div>}
                {features.map((feat, idx) => (
                    <div key={`${feat.name}-${idx}`} className={styles.listItem}>
                        <span className={styles.keyText}>{feat.name}</span>
                        {!disabled && (
                            <IconButton aria-labelledby='' name="trash-alt" variant="destructive" size="sm" onClick={() => handleDelete(feat.name)} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        display: flex; 
        flex-direction: column; 
        gap: ${theme.spacing(2)};
    `,
    inputRow: css`
        display: flex; 
        gap: ${theme.spacing(1)}; 
        align-items: center;
    `,
    fieldGrow: css`
        flex: 1;
    `,
    list: css`
        border: 1px solid ${theme.colors.border.weak}; 
        border-radius: ${theme.shape.borderRadius()};
        background-color: ${theme.colors.background.secondary};
    `,
    listItem: css`
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        gap: ${theme.spacing(2)}; /* Espacio entre el nombre y el botón */

        &:last-child { 
            border-bottom: none; 
        }
        &:hover {
            background: ${theme.colors.action.hover};
        }
    `,
    keyText: css`
        font-weight: 500;
        flex: 1; /* Ocupa todo el espacio disponible empujando el botón a la derecha */
        overflow-wrap: anywhere;  
        word-break: break-word;
        white-space: pre-wrap;
        min-width: 0;           
        color: ${theme.colors.text.primary};
    `,
    empty: css`
        padding: ${theme.spacing(2)}; 
        color: ${theme.colors.text.disabled}; 
        font-style: italic; 
        text-align: center;
    `
});
