import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: ${theme.spacing(2)};
    `,
    toolbar: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        flex-shrink: 0;
    `,
    searchBox: css`
        max-width: 400px;
        flex-grow: 1;
    `,
    // --- LAYOUT 50/50 ---
    splitLayout: css`
        display: flex;
        flex-grow: 1;
        gap: ${theme.spacing(2)};
        overflow: hidden;
    `,
    // Columna Izquierda (Lista)
    leftColumn: css`
        flex: 1; /* 50% del espacio */
        overflow-y: auto;
        padding-right: ${theme.spacing(1)};
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1)};
        
        &::-webkit-scrollbar { width: 6px; }
        &::-webkit-scrollbar-thumb { background: ${theme.colors.action.disabledBackground}; border-radius: 3px; }
    `,
    // Columna Derecha (Panel)
    rightColumn: css`
        flex: 1; /* 50% del espacio */
        padding: ${theme.spacing(3)};
        background-color: ${theme.colors.background.secondary};
        border-radius: ${theme.shape.borderRadius()};
        border: 1px solid ${theme.colors.border.weak};
        /* Si no hay nada seleccionado, centramos el mensaje */
        display: flex; 
        flex-direction: column;
    `,

    // --- TARJETA RICA ---
    cardRow: css`
        display: flex;
        justify-content: space-between;
        padding: ${theme.spacing(2)}; /* Un poco más de aire */
        border: 1px solid ${theme.colors.border.weak};
        background: ${theme.colors.background.elevated};
        cursor: pointer;
        border-radius: ${theme.shape.borderRadius()};
        transition: all 0.1s ease-in-out;
        
        &:hover {
            border-color: ${theme.colors.primary.border};
            background: ${theme.colors.background.secondary};
        }
    `,
    cardRowSelected: css`
        border-color: ${theme.colors.primary.main};
        background: ${theme.colors.action.selected};
        &:hover { background: ${theme.colors.action.selected}; }
    `,
    cardMainInfo: css`
        flex: 1;
        min-width: 0; 
        margin-right: ${theme.spacing(2)};
    `,
    cardTitle: css`
        font-weight: 500;
        font-size: ${theme.typography.h5.fontSize};
        margin-bottom: ${theme.spacing(0.5)};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${theme.colors.text.primary};
    `,
    cardDescription: css`
        color: ${theme.colors.text.secondary};
        font-size: ${theme.typography.bodySmall.fontSize};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
    cardMeta: css`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: ${theme.spacing(0.5)};
        flex-shrink: 0;
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    metaRow: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        color: ${theme.colors.text.secondary};
    `,
    urlText: css`
        max-width: 150px; /* Ajustado para el 50% */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: ${theme.typography.fontFamilyMonospace};
        font-size: 11px;
    `,

    // Helpers Panel
    panelHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: ${theme.spacing(3)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        padding-bottom: ${theme.spacing(2)};
    `,
    rowInputs: css`
        display: flex;
        gap: ${theme.spacing(2)};
        width: 100%;
        margin-top: ${theme.spacing(2)};
        > div { flex: 1; }
    `,
    centerMessage: css`
        margin: auto; /* Centrado perfecto en el flex container */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: ${theme.colors.text.secondary};
        text-align: center;
        opacity: 0.7;
        gap: ${theme.spacing(2)};
    `,
    placeholder: css`
      background-color: ${theme.colors.background.primary};
      color: ${theme.colors.text.secondary};
      opacity: 1;
      padding: ${theme.spacing(3)};
      border-radius: ${theme.shape.borderRadius()};
      border: 1px solid ${theme.colors.border.weak};
    `,
    centerContent: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: ${theme.spacing(2)};
      padding: ${theme.spacing(4)};
      text-align: center;
    `,
    grid: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${theme.spacing(3)};
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    `,
    column: css`
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing(2)};
    `,
});
