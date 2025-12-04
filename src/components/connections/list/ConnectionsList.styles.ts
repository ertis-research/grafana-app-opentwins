import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";

export const getStyles = (theme: GrafanaTheme2) => {
    return {
        container: css`
            padding: ${theme.spacing(2)};
            height: 100%;
            display: flex;
            flex-direction: column;
        `,
        mainLayout: css`
            display: flex;
            flex-direction: row;
            gap: ${theme.spacing(3)};
            height: 100%;
            /* Responsive: Apilar en pantallas pequeñas */
            @media (max-width: 1000px) {
                flex-direction: column;
            }
        `,
        // Panel Izquierdo (Más pequeño, ancho fijo o limitado)
        leftPanel: css`
            flex: 0 0 400px; /* Ancho base fijo, pero flexible si es necesario */
            min-width: 350px;
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing(2)};
            padding: ${theme.spacing(2)};
            background: ${theme.colors.background.secondary};
            border: 1px solid ${theme.colors.border.weak};
            border-radius: ${theme.shape.borderRadius()};
            height: fit-content;
            max-height: 100%;
            overflow-y: auto;

            @media (max-width: 1000px) {
                flex: 1;
                max-height: none;
                width: 100%;
            }
        `,
        // Panel Derecho (Ocupa el resto, para Debug)
        rightPanel: css`
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing(2)};
            padding: ${theme.spacing(2)};
            background: ${theme.colors.background.secondary};
            border: 1px solid ${theme.colors.border.weak};
            border-radius: ${theme.shape.borderRadius()};
            height: 100%;
            min-height: 700px;
            overflow-y: auto;
        `,
        panelHeader: css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid ${theme.colors.border.weak};
            padding-bottom: ${theme.spacing(1.5)};
            margin-bottom: ${theme.spacing(1)};
        `,
        panelTitle: css`
            font-size: ${theme.typography.h4.fontSize};
            font-weight: ${theme.typography.fontWeightBold};
            margin: 0;
        `,
        toolbar: css`
            display: flex;
            flex-direction: column;
            gap: ${theme.spacing(2)};
        `,
        editorContainer: css`
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        `,
        definitionTextArea: css`
            font-family: ${theme.typography.fontFamilyMonospace} !important;
            font-size: 12px;
            min-height: 492px;
            resize: vertical;
        `,
        // Grid para los paneles de debug dentro del panel derecho
        debugGrid: css`
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: ${theme.spacing(2)};
        `,
        debugItem: css`
             background: ${theme.colors.background.primary};
             padding: ${theme.spacing(2)};
             border-radius: ${theme.shape.borderRadius()};
             border: 1px solid ${theme.colors.border.weak};
        `,
        noPermission: css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: ${theme.colors.text.secondary};
        `
    };
};
