import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cx } from '@emotion/css';
import { AppEvents } from '@grafana/data';
import {
  LinkButton, Icon, ConfirmModal, Spinner, InlineSwitch,
  useStyles2, Input, Button
} from '@grafana/ui';
import { getAppEvents } from '@grafana/runtime';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { IDittoThing } from 'utils/interfaces/dittoThing';
import { attributeSimulationOf } from 'utils/data/consts';
import { getCurrentUserRole, isEditor, Roles } from 'utils/auxFunctions/auth';
import { getStyles } from './ThingsList.styles';
import { MainListProps } from './ThingsList.types';
import { ThingCard } from './subcomponents/ThingCard';

// --- Main Component ---

export function ThingsList({
  isType, funcThings, funcDelete, funcDeleteChildren,
  parentId, iniCompactMode = false, iniNoSimulations = false
}: MainListProps) {

  const styles = useStyles2(getStyles);
  const appEvents = getAppEvents();

  const history = useHistory();
  const { url } = useRouteMatch();
  const resourceSegment = isType ? 'types' : 'twins';
  const pluginBase = url.split(`/${resourceSegment}`)[0];
  const resourceRoot = `${pluginBase}/${resourceSegment}`;

  // --- ESTADOS DE DATOS ---
  const [things, setThings] = useState<IDittoThing[]>([]);

  // --- ESTADOS DE PAGINACIÓN ---
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([undefined]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [nextCursorFromApi, setNextCursorFromApi] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // --- ESTADOS DE BÚSQUEDA ---
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- ESTADOS UI ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteModalId, setDeleteModalId] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filtros visuales
  const [compactMode, setCompactMode] = useState<boolean>(iniCompactMode);
  const [noSimulations, setNoSimulations] = useState<boolean>(iniNoSimulations);
  const [userRole, setUserRole] = useState<string>(Roles.VIEWER);

  const title = isType ? "type" : "twin";
  const userIsEditor = isEditor(userRole);
  const PAGE_SIZE = 12;

  // --- LÓGICA DE CARGA ---
  const fetchPage = useCallback(async (cursor: string | undefined, search: string) => {
    setIsLoading(true);
    try {
      // @ts-ignore
      const res = await funcThings(cursor, PAGE_SIZE, search, parentId);

      let loadedItems: IDittoThing[] = [];
      let loadedCursor: string | undefined = undefined;

      if (res && typeof res === 'object' && 'items' in res) {
        loadedItems = res.items;
        loadedCursor = res.cursor;
      } else if (Array.isArray(res)) {
        loadedItems = res;
      }

      setThings(loadedItems);
      setNextCursorFromApi(loadedCursor);
      setHasNextPage(!!loadedCursor);

    } catch (error) {
      console.error(error);
      appEvents.publish({ type: AppEvents.alertError.name, payload: ['Error fetching items'] });
    } finally {
      setIsLoading(false);
    }
  }, [funcThings, appEvents]);

  useEffect(() => {
    const cursorToLoad = cursorStack[currentPageIndex];
    fetchPage(cursorToLoad, searchQuery);
    getCurrentUserRole().then(setUserRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex, searchQuery, fetchPage]);

  // --- FILTROS CLIENTE ---
  const filteredThings = useMemo(() => {
    let result = things;
    if (noSimulations) {
      result = result.filter(item => !item.attributes || !item.attributes[attributeSimulationOf]);
    }
    return result;
  }, [things, noSimulations]);

  const hasSimulatedItems = useMemo(() =>
    things.some(item => item.attributes && item.attributes[attributeSimulationOf]),
    [things]);

  // --- ACCIONES ---

  const goNext = () => {
    if (hasNextPage && nextCursorFromApi) {
      const newStack = [...cursorStack.slice(0, currentPageIndex + 1), nextCursorFromApi];
      setCursorStack(newStack);
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const triggerSearch = () => {
    setCursorStack([undefined]);
    setCurrentPageIndex(0);
    setSearchQuery(inputValue);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const handleDelete = async (id: string, withChildren: boolean) => {
    setDeleteModalId(undefined);
    setIsDeleting(true);
    const deleteFunc = withChildren && funcDeleteChildren ? funcDeleteChildren : funcDelete;
    try {
      await deleteFunc(id);
      appEvents.publish({ type: AppEvents.alertSuccess.name, payload: [`The ${title} has been deleted correctly.`] });
      setThings(prev => prev.filter(t => t.thingId !== id));
    } catch (error) {
      console.error(error);
      appEvents.publish({ type: AppEvents.alertError.name, payload: [`The ${title} could not be deleted.`] });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = () => {
    if (parentId) {
      history.push(`${resourceRoot}/${parentId}/new`);
    } else {
      history.push(`${resourceRoot}/new`);
    }
  }

  // --- RENDERIZADO AUXILIAR ---

  const renderPagination = () => {
    // Solo mostrar paginación si hay items o si estamos navegando (no en carga inicial vacía)
    if (things.length === 0 && currentPageIndex === 0) return null;

    return (
      <div className={styles.paginationBar}>
        <Button
          variant="secondary"
          fill="outline"
          size="sm"
          icon="arrow-left"
          onClick={goPrev}
          disabled={currentPageIndex === 0 || isLoading}
        >
          Previous
        </Button>

        <span className={styles.pageInfo}>
          Page {currentPageIndex + 1}
        </span>

        <Button
          variant="secondary"
          fill="outline"
          size="sm"
          onClick={goNext}
          disabled={!hasNextPage || isLoading}
        >
          Next <Icon name="arrow-right" style={{ marginLeft: 8 }} />
        </Button>
      </div>
    );
  };

  // --- RENDERIZADO PRINCIPAL ---

  // Loading Inicial pantalla completa
  if (isLoading && things.length === 0 && currentPageIndex === 0) {
    return <div className={styles.loadingContainer}><Spinner size={20} /></div>;
  }

  // Empty State
  if (!isLoading && things.length === 0 && !searchQuery && currentPageIndex === 0) {
    return (
      <div className={styles.centerContent}>
        <h3>No {title}s found</h3>
        <p>{parentId ? `There are no children configured for this ${title} yet.` : `There are no ${title}s`}</p>
        <LinkButton icon="plus" hidden={!userIsEditor} variant="primary" onClick={handleCreate}>
          New {title}
        </LinkButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* --- TOOLBAR REORGANIZADA --- */}
      <div className={cx('row justify-content-between align-items-center', styles.toolbar)}>

        {/* IZQUIERDA: Buscador + Filtros */}
        <div className="col-12 col-md-9 mb-2 d-flex align-items-center flex-wrap">
          {/* Input Buscador */}
          <div style={{ flexGrow: 1, maxWidth: '400px', marginRight: '20px' }}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={handleSearchKeyDown}
              prefix={<Icon name="search" />}
              suffix={
                <Icon
                  name="arrow-right"
                  style={{ cursor: 'pointer', opacity: inputValue ? 1 : 0.5 }}
                  onClick={triggerSearch}
                  title="Press Enter to search"
                />
              }
              placeholder="Search ID or Name..."
            />
          </div>

          {/* Filtros a la derecha del search */}
          <div className="d-flex align-items-center">
            <InlineSwitch
              value={compactMode}
              onChange={() => setCompactMode(!compactMode)}
              label="Compact"
              showLabel={true}
              className={styles.switchSpacing}
            />

            {!isType && <InlineSwitch
              value={!noSimulations}
              onChange={() => setNoSimulations(!noSimulations)}
              label="Simulated"
              showLabel={true}
              disabled={!hasSimulatedItems}
              className={styles.switchSpacing}
            /> }
          </div>
        </div>

        {/* DERECHA: Botón Nuevo */}
        <div className="col-12 col-md-3 mb-2 d-flex justify-content-end">
          <LinkButton icon="plus" hidden={!userIsEditor} variant="primary" onClick={handleCreate}>
            New {title}
          </LinkButton>
        </div>
      </div>

      {isDeleting && (
        <div className={styles.loadingContainer}><Spinner inline={true} size={20} /></div>
      )}

      {/* --- PAGINACIÓN SUPERIOR --- */}
      {renderPagination()}

      {/* --- GRID DE TARJETAS --- */}
      {isLoading ? (
        <div className={styles.loadingContainer}><Spinner size={32} /></div>
      ) : (
        <div className="row">
          {filteredThings.length > 0 ? (
            filteredThings.map(item => (
              <ThingCard
                key={item.thingId} thing={item} isEditor={userIsEditor}
                isCompact={compactMode} styles={styles} parentId={parentId} isType={isType}
                onDelete={(id: any) => setDeleteModalId(id)} resourceRoot={resourceRoot}
              />
            ))
          ) : (
            <div className={styles.loadingContainer}>
              <h5>No items found matching "{searchQuery}"</h5>
            </div>
          )}
        </div>
      )}

      {/* MODAL BORRADO */}
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