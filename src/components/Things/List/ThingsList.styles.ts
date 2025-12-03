import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";

export const getStyles = (theme: GrafanaTheme2) => {
  const cardBorder = `1px solid ${theme.colors.border.weak}`;
  const cardBackground = theme.colors.background.elevated;

  return {
    container: css`
    width: 100%;
  `,
    loadingContainer: css`
    display: flex; justify-content: center; width: 100%; margin: ${theme.spacing(4)} 0;
  `,
  searchContainer: css`
        flex-grow: 1;
        max-width: 400px;
    `,
    emptyContainer: css`
    display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: ${theme.spacing(4)};
  `,
    toolbar: css`
    border-bottom: 1px solid ${theme.colors.border.weak};
    padding-bottom: ${theme.spacing(1)};
  `,
  switchSpacing: css`
      margin-right: ${theme.spacing(2)} !important;
    `,
    // --- Estilos de Tarjeta Rediseñados ---
    cardWrapper: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${cardBackground};
    border: ${cardBorder};
    border-radius: ${theme.shape.borderRadius()};
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      border-color: ${theme.colors.primary.border};
      background-color: ${theme.colors.background.primary};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.z1};
    }
  `,
    // Contenedor de imagen superior (Altura fija más pequeña)
    imageContainer: css`
    height: 140px; 
    width: 100%; 
    position: relative;
    background-color: ${theme.colors.background.canvas};
    border-bottom: ${cardBorder};
  `,
    image: css`
    height: 100%; width: 100%; object-fit: cover; object-position: center;
  `,
    parentBadge: css`
    position: absolute;
    top: 0; right: 0;
    background-color: rgba(0,0,0,0.6); // Fondo semitransparente
    color: ${theme.colors.text.primary};
    padding: 2px 8px;
    font-size: ${theme.typography.bodySmall.fontSize};
    border-bottom-left-radius: ${theme.shape.borderRadius()};
    backdrop-filter: blur(2px);
  `,
    // Contenido principal
    contentContainer: css`
    padding: ${theme.spacing(1.5)};
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  `,
    cardTitle: css`
    margin: 0;
    font-size: ${theme.typography.h6.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color: ${theme.colors.text.primary};
  `,
    cardId: css`
    margin: 0 0 ${theme.spacing(1)} 0;
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
    font-family: ${theme.typography.fontFamilyMonospace};
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0.8;
  `,
    cardDescription: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
    // Truco CSS para limitar a 3 líneas y poner puntos suspensivos
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1; // Empuja los botones hacia abajo
  `,
    // Footer con acciones
    cardActions: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
    border-top: ${cardBorder};
    background-color: ${theme.colors.background.primary};
  `,
    // Estilos específicos para el modo compacto
    compactCard: css`
    padding: ${theme.spacing(1)};
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: space-between;
    border: ${cardBorder};
    background-color: ${cardBackground};
    border-radius: ${theme.shape.borderRadius()};
     &:hover {
      border-color: ${theme.colors.primary.border};
      background-color: ${theme.colors.background.primary};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.z1};
    }
  `,
    linkReset: css`
    text-decoration: none; color: inherit; display: block; height: 100%;
    &:hover { text-decoration: none; color: inherit; }
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
    loadMoreContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: ${theme.spacing(3)};
        margin-bottom: ${theme.spacing(2)};
    `,
    paginationBar: css`
        display: flex;
        justify-content: center; // A la derecha o 'center' si prefieres centrado
        align-items: center;
        gap: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
        margin-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(1)};
    `,

    pageInfo: css`
        font-weight: 500;
        color: ${theme.colors.text.secondary};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
  }
};