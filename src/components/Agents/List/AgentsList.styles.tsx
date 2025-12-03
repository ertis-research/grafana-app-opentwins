import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";


export const getStyles = (theme: GrafanaTheme2) => ({
    wrapper: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        gap: ${theme.spacing(2)};
    `,
    loadingContainer: css`
        display: flex;
        justify-content: center;
        padding-top: 100px;
    `,
    toolbar: css`
        display: flex;
        gap: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
        border-bottom: 1px solid ${theme.colors.border.weak};
        flex-shrink: 0;
        align-items: center;
    `,
    searchContainer: css`
        flex-grow: 1;
        max-width: 400px;
    `,

    // --- SPLIT LAYOUT GRID ---
    splitLayout: css`
        display: grid;
        /* Aquí definimos el 2/3 vs 1/3 */
        grid-template-columns: 2fr 1fr;
        gap: ${theme.spacing(2)};
        overflow: hidden; /* Importante para que el scroll sea interno */
        
        /* Responsive: Si la pantalla es pequeña (< 1000px), apilamos en 1 columna */
        @media (max-width: 1000px) {
            grid-template-columns: 1fr;
            overflow-y: auto; /* Scroll global en móvil */
        }
    `,

    // --- COLUMNA IZQUIERDA (LISTA) ---
    leftColumn: css`
        display: flex;
        flex-direction: column;
        overflow-y: auto; /* Scroll independiente */
        padding-right: ${theme.spacing(1)};

        /* Scrollbar styling */
        &::-webkit-scrollbar { width: 6px; }
        &::-webkit-scrollbar-thumb { background: ${theme.colors.action.disabledBackground}; border-radius: 3px; }
        &::-webkit-scrollbar-track { background: transparent; }
    `,
    cardsGrid: css`
        display: grid;
        /* Las tarjetas se adaptan al espacio disponible (2/3 de la pantalla) */
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: ${theme.spacing(1.5)};
        padding-bottom: ${theme.spacing(2)};
        padding-top: ${theme.spacing(0.5)};
    `,

    // --- COLUMNA DERECHA (DETALLES) ---
    rightColumn: css`
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        background-color: ${theme.colors.background.primary};
        border: 1px solid ${theme.colors.border.weak};
        border-radius: ${theme.shape.borderRadius()};
        position: relative;
        min-height: 0; /* Fix para flex items overflow */

        /* En móvil, le damos una altura mínima si se apila */
        @media (max-width: 1000px) {
            min-height: 400px;
        }
    `,
    detailsContent: css`
        flex: 1;
        /* Si AgentDetails no tiene padding interno, descomentar abajo */
        /* padding: ${theme.spacing(2)}; */
    `,

    // --- PLACEHOLDER & MENSAJES ---
    centerContent: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${theme.spacing(2)};
        padding: ${theme.spacing(4)};
        text-align: center;
    `,
    centerMessage: css`
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${theme.colors.text.secondary};
        opacity: 0.7;
    `,
    placeholderContainer: css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: ${theme.spacing(3)};
    `,
    placeholderContent: css`
        text-align: center;
        color: ${theme.colors.text.secondary};
        opacity: 0.6;
        height: 100%;
        align-content: center;
        max-width: 250px;
        
        h4 {
            margin-bottom: ${theme.spacing(1)};
            color: ${theme.colors.text.primary};
        }
    `,
});