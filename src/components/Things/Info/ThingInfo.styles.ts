import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      gap: ${theme.spacing(3)};
      flex-wrap: wrap;
      width: 100%;
      align-items: flex-start;
    `,
    columnCard: css`
      background-color: ${theme.colors.background.secondary};
      border: 1px solid ${theme.colors.border.weak};
      border-radius: ${theme.shape.borderRadius(2)};
      padding: ${theme.spacing(2)};
      flex: 1;
      min-width: 350px; /* Un poco más ancho para acomodar el grid de 180px */
      box-shadow: ${theme.shadows.z1};
    `,
    sectionHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 2px solid ${theme.colors.border.weak};
      padding-bottom: ${theme.spacing(1)};
      margin-bottom: ${theme.spacing(2)};
    `,
    titleText: css`
      margin: 0;
      font-size: ${theme.typography.h4.fontSize};
      font-weight: ${theme.typography.fontWeightBold};
      color: ${theme.colors.text.primary};
    `,
    subTitleText: css`
      font-size: ${theme.typography.bodySmall.fontSize};
      color: ${theme.colors.text.secondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `,

    // --- BUSCADOR ---
    searchContainer: css`
      margin-bottom: ${theme.spacing(2)};
    `,

    // --- FEATURES ---
    featureCard: css`
      background-color: ${theme.colors.background.primary};
      border: 1px solid ${theme.colors.border.weak};
      border-radius: ${theme.shape.borderRadius()};
      margin-bottom: ${theme.spacing(2)};
      overflow: hidden;
    `,
    featureHeader: css`
      background-color: ${theme.colors.contrastThreshold};
      padding: ${theme.spacing(1, 1.5)};
      border-bottom: 1px solid ${theme.colors.border.weak};
      font-weight: ${theme.typography.fontWeightMedium};
      font-size: ${theme.typography.body.fontSize};
      color: ${theme.colors.text.primary};
      display: flex;
      align-items: center;
      gap: ${theme.spacing(1)};
    `,
    
    // Grid actualizado con tu preferencia
    propertiesGrid: css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: ${theme.spacing(1.5)};
      padding: ${theme.spacing(1.5)};
    `,

    // --- KEY-VALUES ---
    kvContainer: css`
      display: flex;
      flex-direction: column;
    `,
    kvLabel: css`
      font-size: 11px;
      color: ${theme.colors.text.secondary};
      text-transform: uppercase;
      margin-bottom: 2px;
    `,
    kvValue: css`
      font-size: 13px;
      color: ${theme.colors.text.primary};
      font-weight: 500;
      word-break: break-all;
      line-height: 1.4;
    `,

    // --- LINKS ---
    parentLink: css`
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: ${theme.colors.action.selected};
      color: ${theme.colors.primary.text};
      border: 1px solid ${theme.colors.primary.border};
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 12px;
      text-decoration: none;
      transition: all 0.2s ease-in-out;
      margin-right: 6px;
      margin-bottom: 4px;
      cursor: pointer;

      &:hover {
        background-color: ${theme.colors.primary.main};
        color: ${theme.colors.primary.contrastText};
        text-decoration: none;
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.z1};
      }
    `
  };
};
