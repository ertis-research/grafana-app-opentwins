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
            /* Responsive: Stack on small screens */
            @media (max-width: 1000px) {
                flex-direction: column;
            }
        `,
        panel: css`
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
            gap: ${theme.spacing(2)};
            align-items: center;
        `,
        editorContainer: css`
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        `,
        codeTextArea: css`
            font-family: ${theme.typography.fontFamilyMonospace} !important;
            font-size: 12px;
            flex-grow: 1;
            resize: none; 
            min-height: 300px;
        `,
        actionsRow: css`
            display: flex;
            justify-content: flex-end;
            gap: ${theme.spacing(1)};
            margin-top: auto;
        `,
        disclaimerBox: css`
            margin-bottom: ${theme.spacing(0)};
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