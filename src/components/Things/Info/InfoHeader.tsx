import React from 'react'
import { css } from '@emotion/css'
import { GrafanaTheme2 } from '@grafana/data'
import { FilterPill, useStyles2, Icon, useTheme2 } from '@grafana/ui'
import { capitalize, defaultIfNoExist } from 'utils/auxFunctions/general'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { ButtonsInfo } from '../Form/subcomponents/buttonsInfo'

interface Parameters {
    thing: IDittoThing
    isType: boolean
    sections: string[]
    selected: string
    setSelected: (section: string) => void
    funcDelete: any
    funcDeleteChildren?: any
}

export const InfoHeader = ({ thing, isType, sections, selected, setSelected, funcDelete, funcDeleteChildren }: Parameters) => {
    
    // 1. Hook de estilos 
    const styles = useStyles2(getStyles);
    const theme = useTheme2();

    const hasImage = thing.attributes?.image;
    const name = defaultIfNoExist(thing.attributes, "name", thing.thingId);

    return (
        <div className={styles.container}>
            {/* SECCIÓN IZQUIERDA: Identidad (Imagen + Textos) */}
            <div className={styles.identityGroup}>
                <div className={styles.imageContainer}>
                    {hasImage ? (
                        <img 
                            src={thing.attributes.image} 
                            alt={name}
                            className={styles.image} 
                        />
                    ) : (
                        // Placeholder si no hay imagen
                        <div className={styles.placeholder}>
                            <Icon name="cube" size="xxl" style={{ color: theme.colors.text.secondary }} />
                        </div>
                    )}
                </div>
                
                <div className={styles.textContainer}>
                    <h2 className={styles.title}>{name}</h2>
                    <div className={styles.subtitle}>
                        <span className={styles.idLabel}>ID:</span> {thing.thingId}
                    </div>
                </div>
            </div>

            {/* SECCIÓN CENTRAL: Navegación (Tabs) */}
            <div className={styles.navigationGroup}>
                {sections.map((item) => (
                    <FilterPill
                        key={item}
                        label={capitalize(item)}
                        selected={item === selected}
                        onClick={() => setSelected(item)}
                    />
                ))}
            </div>

            {/* SECCIÓN DERECHA: Acciones */}
            <div className={styles.actionsGroup}>
                <ButtonsInfo  
                    thingId={thing.thingId} 
                    isType={isType} 
                    funcDelete={funcDelete} 
                    funcDeleteChildren={funcDeleteChildren} 
                />
            </div>
        </div>
    )
}

// 2. Definición de estilos usando el Tema de Grafana
const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        display: flex;
        flex-wrap: wrap; // Permite que baje de línea en pantallas pequeñas
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(2)};
        background: ${theme.colors.background.secondary};
        border-bottom: 1px solid ${theme.colors.border.weak};
        gap: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
        margin-top: -${theme.spacing(2)};
        margin-left: -${theme.spacing(2)};
        margin-right: -${theme.spacing(2)};
    `,
    identityGroup: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        min-width: 250px;
    `,
    imageContainer: css`
        width: 64px;
        height: 64px;
        flex-shrink: 0;
    `,
    image: css`
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: ${theme.shape.radius.default};
        border: 1px solid ${theme.colors.border.weak};
        box-shadow: ${theme.shadows.z1};
    `,
    placeholder: css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${theme.colors.background.primary};
        border-radius: ${theme.shape.radius.default};
        border: 1px dashed ${theme.colors.border.medium};
    `,
    textContainer: css`
        display: flex;
        flex-direction: column;
        justify-content: center;
    `,
    title: css`
        margin: 0;
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        line-height: 1.2;
    `,
    subtitle: css`
        margin: 0;
        font-size: ${theme.typography.bodySmall.fontSize};
        color: ${theme.colors.text.secondary};
        font-family: ${theme.typography.fontFamilyMonospace};
        display: flex;
        align-items: center;
        gap: ${theme.spacing(0.5)};
    `,
    idLabel: css`
        font-weight: ${theme.typography.fontWeightBold};
        text-transform: uppercase;
        font-size: 10px;
        margin-top: 2px;
        background: ${theme.colors.background.primary};
        padding: 0 4px;
        border-radius: 3px;
    `,
    navigationGroup: css`
        display: flex;
        gap: ${theme.spacing(1)};
        flex-wrap: wrap;
        justify-content: center;
        flex: 1; // Ocupa el espacio central disponible
    `,
    actionsGroup: css`
        display: flex;
        justify-content: flex-end;
    `
});
