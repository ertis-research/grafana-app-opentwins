import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  centeredWrapper: css`
    display: flex;
    justify-content: center;
    width: 100%;
    padding-bottom: ${theme.spacing(4)};
  `,
  formPanel: css`
    background-color: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius()};
    padding: ${theme.spacing(4)};
    box-shadow: ${theme.shadows.z1};
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing(3)};
    border-bottom: 1px solid ${theme.colors.border.weak};
    padding-bottom: ${theme.spacing(2)};
    
    h2 {
      margin: 0;
      font-size: ${theme.typography.h3.fontSize};
    }
  `,
  formContainer: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: ${theme.spacing(2)};
  `,
  // Method y URL alineados con Grid
  methodUrlGrid: css`
    display: grid;
    grid-template-columns: 160px 1fr; /* 160px para Method, el resto para URL */
    gap: ${theme.spacing(2)};
    align-items: start;

    @media (max-width: 600px) {
      grid-template-columns: 1fr; /* En móviles, uno debajo del otro */
    }
  `,
  subSection: css`
    padding: ${theme.spacing(2)};
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.shape.borderRadius()};
    margin-bottom: ${theme.spacing(2)};
    border: 1px solid ${theme.colors.border.weak};
  `,
  sectionDesc: css`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.bodySmall.fontSize};
    margin-bottom: ${theme.spacing(2)};
    margin-top: -${theme.spacing(1)};
  `,
  textArea: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    min-height: 400px;
    resize: vertical;
    margin-top: ${theme.spacing(2)};
    font-size: 12px;
  `,
  buttonGroup: css`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing(2)};
    margin-top: ${theme.spacing(4)};
    padding-top: ${theme.spacing(2)};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  fieldSet: css`
    margin-bottom: 0px;
  `
});
