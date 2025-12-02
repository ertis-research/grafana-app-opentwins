import React, { useState } from 'react';
import { IAttribute } from 'utils/interfaces/dittoThing';
import { Button, Input, IconButton, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

interface Props {
    attributes: IAttribute[];
    setAttributes: (attrs: IAttribute[]) => void;
    disabled: boolean;
}

export const AttributeList = ({ attributes, setAttributes, disabled }: Props) => {
    const styles = useStyles2(getStyles);
    const [newItem, setNewItem] = useState<IAttribute>({ key: '', value: '' });

    const handleAdd = () => {
        if (!newItem.key) return;
        // Upsert (update or insert)
        const existingIndex = attributes.findIndex(a => a.key === newItem.key);
        if (existingIndex >= 0) {
            const updated = [...attributes];
            updated[existingIndex] = newItem;
            setAttributes(updated);
        } else {
            setAttributes([...attributes, newItem]);
        }
        setNewItem({ key: '', value: '' });
    };

    const handleDelete = (key: string) => {
        setAttributes(attributes.filter(a => a.key !== key));
    };

    return (
        <div className={styles.container}>
            {/* Input Row */}
            {!disabled && (
                <div className={styles.inputRow}>
                    <div className={styles.fieldGrow}>
                        <Input 
                            placeholder="Key (e.g. location)" 
                            value={newItem.key} 
                            onChange={e => setNewItem({...newItem, key: e.currentTarget.value})}
                        />
                    </div>
                    <div className={styles.fieldGrow}>
                        <Input 
                            placeholder="Value (e.g. Warehouse 1)" 
                            value={String(newItem.value)} 
                            onChange={e => setNewItem({...newItem, value: e.currentTarget.value})}
                        />
                    </div>
                    <Button variant="secondary" onClick={handleAdd} icon="plus">Add</Button>
                </div>
            )}

            {/* List */}
            <div className={styles.list}>
                {attributes.length === 0 && <div className={styles.empty}>No attributes added.</div>}
                {attributes.map((attr, idx) => (
                    <div key={`${attr.key}-${idx}`} className={styles.listItem}>
                        <span className={styles.keyText}>{attr.key}:</span>
                        <span className={styles.valueText}>{String(attr.value)}</span>
                        {!disabled && (
                            <IconButton aria-labelledby='' name="trash-alt" variant="destructive" size="sm" onClick={() => handleDelete(attr.key)} />
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
        align-items: flex-start; /* Alineamos arriba por si los inputs tienen distinta altura */
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
        align-items: center; /* Puedes cambiar a 'flex-start' si quieres el botón arriba en textos muy largos */
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        gap: ${theme.spacing(2)}; 
        
        &:last-child { 
            border-bottom: none; 
        }
        &:hover { 
            background: ${theme.colors.action.hover}; 
        }
    `,
    /* Contenedor para agrupar Key y Value visualmente */
    textWrapper: css`
        display: flex;
        flex-direction: column; /* En pantallas muy pequeñas, key y value uno debajo del otro */
        flex: 1;
        gap: ${theme.spacing(0.5)};
        
        @media (min-width: 600px) {
            flex-direction: row;
            align-items: baseline;
        }
    `,
    keyText: css`
        font-weight: 600; 
        margin-right: ${theme.spacing(1)};
        white-space: nowrap; /* Evita que la Key se rompa si es corta */
        flex-shrink: 0;      /* Asegura que la Key no se aplaste */
        color: ${theme.colors.text.primary};
    `,
    valueText: css`
        flex: 1; 
        color: ${theme.colors.text.secondary};
        
        /* PROPIEDADES CLAVE PARA EL WRAPPING */
        white-space: pre-wrap;      /* Respeta saltos de línea si los hay */
        overflow-wrap: anywhere;    /* Rompe palabras largas en cualquier punto si es necesario */
        word-break: break-word;     /* Compatibilidad adicional */
        min-width: 0;               /* Truco Flexbox: permite que el texto haga wrap dentro de un flex child */
    `,
    empty: css`
        padding: ${theme.spacing(2)}; 
        color: ${theme.colors.text.disabled}; 
        font-style: italic; 
        text-align: center;
    `
});
