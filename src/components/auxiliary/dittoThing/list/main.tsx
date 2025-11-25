import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2, AppEvents, AppPluginMeta, KeyValue } from '@grafana/data';
import {
  LinkButton, Icon, ConfirmModal, Spinner, InlineSwitch,
  useStyles2, Input
} from '@grafana/ui';
import { getAppEvents } from '@grafana/runtime';

import { IDittoThing } from 'utils/interfaces/dittoThing';
import { defaultIfNoExist, imageIsUndefined } from 'utils/auxFunctions/general';
import { attributeSimulationOf } from 'utils/data/consts';
import { getCurrentUserRole, isEditor, Roles } from 'utils/auxFunctions/auth';

// --- Interfaces ---
interface MainListProps {
  path: string;
  meta: AppPluginMeta<KeyValue<any>>;
  isType: boolean;
  funcThings: () => Promise<any>;
  funcDelete: (id: string) => Promise<void>;
  funcDeleteChildren?: (id: string) => Promise<void>;
  parentId?: string;
  iniCompactMode?: boolean;
  iniNoSimulations?: boolean;
}

interface ThingCardProps {
  thing: IDittoThing;
  path: string;
  isEditor: boolean;
  isCompact: boolean;
  styles: any;
  parentId?: string;
  onDelete: (id: string) => void;
  isType: boolean;
}

// --- Styles (NUEVO DISEÑO MÁS PROFESIONAL) ---
const getStyles = (theme: GrafanaTheme2) => {
  const cardBorder = `1px solid ${theme.colors.border.weak}`;
  const cardBackground = theme.colors.background.secondary;

  return {
    container: css`
    width: 100%;
  `,
    loadingContainer: css`
    display: flex; justify-content: center; width: 100%; margin: ${theme.spacing(4)} 0;
  `,
    emptyContainer: css`
    display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: ${theme.spacing(4)};
  `,
    toolbar: css`
    margin-bottom: ${theme.spacing(2)};
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
    transition: box-shadow 0.2s ease-in-out, border-color 0.2s;
    &:hover {
      border-color: ${theme.colors.border.medium};
      box-shadow: ${theme.shadows.z2};
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
    justify-content: space-between;
    border: ${cardBorder};
    background-color: ${cardBackground};
    border-radius: ${theme.shape.borderRadius()};
     &:hover {
      border-color: ${theme.colors.border.medium};
    }
  `,
    linkReset: css`
    text-decoration: none; color: inherit; display: block; height: 100%;
    &:hover { text-decoration: none; color: inherit; }
  `
  }
};

// --- Sub-component: The Professional Card ---

const ThingCard: React.FC<ThingCardProps> = ({ thing, path, isEditor, isCompact, styles, parentId, onDelete, isType }) => {
  const name = defaultIfNoExist(thing.attributes, "name", thing.thingId || '').trim();
  const description = defaultIfNoExist(thing.attributes, "description", "");
  const imageUrl = imageIsUndefined(defaultIfNoExist(thing.attributes, "image", undefined));

  const parentCount = (isType && parentId && thing.attributes?._parents?.[parentId])
    ? thing.attributes._parents[parentId]
    : null;

  const linkUrl = `${path}&mode=check&id=${thing.thingId}&section=information`;

  // --- Modo Compacto (Solo texto, más pequeño) ---
  if (isCompact) {
    return (
      // Usamos col-md-4 col-lg-3 col-xl-2 para que sean PEQUEÑAS
      <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
        <div className={styles.compactCard}>
          <a href={linkUrl} className={styles.linkReset}>
            <div>
              <h6 className={styles.cardTitle} style={{ fontSize: '0.9rem' }}>{name}</h6>
              <p className={styles.cardId} style={{ fontSize: '0.75rem' }}>{thing.thingId}</p>
            </div>
          </a>
          {isEditor && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              {/* Usamos IconButtons más pequeños para el modo compacto */}
              <LinkButton fill='text' variant='secondary' size="sm" icon="pen" tooltip="Edit" href={`${path}&mode=edit&element=${isType ? 'type' : 'twin'}&id=${thing.thingId}`} />
              <LinkButton fill='text' variant='destructive' size="sm" icon="trash-alt" tooltip="Delete" onClick={(e) => { e.preventDefault(); onDelete(thing.thingId); }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Modo Estándar (Diseño Apilado Profesional) ---
  return (
    // Usamos col-sm-6 col-md-4 col-lg-3 col-xl-2 para que quepan muchas y sean pequeñas
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
      <div className={styles.cardWrapper}>
        {/* 1. Imagen Superior */}
        <div className={styles.imageContainer}>
          {parentCount && <div className={styles.parentBadge}>x{parentCount} children</div>}
          <a href={linkUrl} className={styles.linkReset}>
            <img src={imageUrl} className={styles.image} alt={name} loading="lazy" />
          </a>
        </div>

        {/* 2. Contenido Central */}
        <div className={styles.contentContainer}>
          <a href={linkUrl} className={styles.linkReset}>
            <h5 className={styles.cardTitle}>{name}</h5>
            <p className={styles.cardId} title={thing.thingId}>{thing.thingId}</p>
            <p className={styles.cardDescription}>{description}</p>
          </a>
        </div>

        {/* 3. Pie de acciones (Solo si es editor) */}
        {isEditor && (
          <div className={styles.cardActions}>
            {/* Usamos LinkButton variante 'secondary' para que sea sutil hasta hacer hover */}
            <LinkButton fill='text' variant='secondary' size="sm" icon="pen" tooltip="Edit" href={`${path}&mode=edit&element=${isType ? 'type' : 'twin'}&id=${thing.thingId}`} />
            <LinkButton fill='text' variant='destructive' size="sm" icon="trash-alt" tooltip="Delete" onClick={(e) => { e.preventDefault(); onDelete(thing.thingId); }} />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component (Sin cambios mayores en lógica, solo en estructura de renderizado) ---

export function MainList({
  path, isType, funcThings, funcDelete, funcDeleteChildren,
  parentId, iniCompactMode = false, iniNoSimulations = false
}: MainListProps) {

  const styles = useStyles2(getStyles);
  const appEvents = getAppEvents();

  const [things, setThings] = useState<IDittoThing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteModalId, setDeleteModalId] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [compactMode, setCompactMode] = useState<boolean>(iniCompactMode);
  const [noSimulations, setNoSimulations] = useState<boolean>(iniNoSimulations);
  const [userRole, setUserRole] = useState<string>(Roles.VIEWER);

  const title = isType ? "type" : "twin";
  const userIsEditor = isEditor(userRole);

  const fetchThings = useCallback(async () => {
    setIsLoading(true);
    try {
      let res = await funcThings();
      if (res.hasOwnProperty("items")) { res = res.items; }
      setThings(res);
    } catch (error) {
      console.error(error);
      appEvents.publish({ type: AppEvents.alertError.name, payload: ['Error fetching items'] });
    } finally {
      setIsLoading(false);
    }
  }, [funcThings, appEvents]);

  useEffect(() => {
    fetchThings();
    getCurrentUserRole().then(setUserRole);
  }, [fetchThings]);

  const filteredThings = useMemo(() => {
    let result = things;
    if (noSimulations) {
      result = result.filter(item => !item.attributes || !item.attributes[attributeSimulationOf]);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(thing => thing.thingId?.toLowerCase().includes(lowerQuery));
    }
    return result;
  }, [things, noSimulations, searchQuery]);

  const hasSimulatedItems = useMemo(() =>
    things.some(item => item.attributes && item.attributes[attributeSimulationOf]),
    [things]);

  const handleDelete = async (id: string, withChildren: boolean) => {
    setDeleteModalId(undefined);
    setIsDeleting(true);
    const deleteFunc = withChildren && funcDeleteChildren ? funcDeleteChildren : funcDelete;
    try {
      await deleteFunc(id);
      appEvents.publish({ type: AppEvents.alertSuccess.name, payload: [`The ${title} has been deleted correctly.`] });
      await fetchThings();
    } catch (error) {
      console.error(error);
      appEvents.publish({ type: AppEvents.alertError.name, payload: [`The ${title} could not be deleted.`] });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderAddButton = () => (
    <LinkButton icon="plus" hidden={!userIsEditor} variant="primary" href={`${path}&mode=create${parentId ? `&id=${parentId}` : ""}`}>
      Create new {title}
    </LinkButton>
  );

  if (isLoading && things.length === 0) {
    return <div className={styles.loadingContainer}><Spinner size={20} /></div>;
  }

  if (!isLoading && things.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h5>{parentId ? `This ${title} has no children` : `There are no ${title}s`}</h5>
        {renderAddButton()}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={cx('row justify-content-between', styles.toolbar)}>
        <div className="col-12 col-md-5 mb-2">
          <Input value={searchQuery} prefix={<Icon name="search" />} onChange={(e) => setSearchQuery(e.currentTarget.value)} placeholder="Search..." />
        </div>
        <div className="col-12 col-md-7 mb-2 d-flex align-items-center justify-content-end">
          <div className="d-flex align-items-center mr-3" style={{marginRight: '10px'}}>
            <InlineSwitch value={compactMode} onChange={() => setCompactMode(!compactMode)} label="Compact" showLabel={true} />
            {hasSimulatedItems && (
              <InlineSwitch value={!noSimulations} onChange={() => setNoSimulations(!noSimulations)} label="Simulated" showLabel={true} />
            )}
          </div>
          {renderAddButton()}
        </div>
      </div>

      {isDeleting && (
        <div className={styles.loadingContainer}><Spinner inline={true} size={20} /></div>
      )}

      <div className="row">
        {filteredThings.length > 0 ? (
          filteredThings.map(item => (
            <ThingCard
              key={item.thingId} thing={item} path={path} isEditor={userIsEditor}
              isCompact={compactMode} styles={styles} parentId={parentId} isType={isType}
              onDelete={(id) => setDeleteModalId(id)}
            />
          ))
        ) : (
          <div className={styles.loadingContainer}><h5>No items match the filters</h5></div>
        )}
      </div>

      {!!deleteModalId && (
        <ConfirmModal
          isOpen={true} title={`Delete ${title}`}
          body={`Are you sure you want to remove the ${title} with id ${deleteModalId}?`}
          description={!isType && funcDeleteChildren ? "Choose removal type." : undefined}
          confirmText={!isType && funcDeleteChildren ? "With children" : "Delete"}
          alternativeText={!isType && funcDeleteChildren ? "Without children" : undefined}
          dismissText="Cancel"
          onConfirm={() => handleDelete(deleteModalId, true)}
          onAlternative={!isType && funcDeleteChildren ? () => handleDelete(deleteModalId, false) : undefined}
          onDismiss={() => setDeleteModalId(undefined)}
        />
      )}
    </div>
  );
}
