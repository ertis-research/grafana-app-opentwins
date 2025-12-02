import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cx } from '@emotion/css';
import { AppEvents } from '@grafana/data';
import {
  LinkButton, Icon, ConfirmModal, Spinner, InlineSwitch,
  useStyles2, Input
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

  const handleCreate = () => {
    if (parentId) {
      history.push(`${resourceRoot}/${parentId}/new`);
    } else {
      history.push(`${resourceRoot}/new`);
    }
  }

  const renderAddButton = () => (
    <LinkButton icon="plus" hidden={!userIsEditor} variant="primary" onClick={handleCreate}>
      New {title}
    </LinkButton>
  );

  if (isLoading && things.length === 0) {
    return <div className={styles.loadingContainer}><Spinner size={20} /></div>;
  }

  if (!isLoading && things.length === 0) {
    return (
      <div className={styles.centerContent}>
        <h3>No {title}s found</h3>
        <p>{parentId ? `There are no children configured for this ${title} yet.` : `There are no ${title}s`}</p>
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
          <div className="d-flex align-items-center mr-3" style={{ marginRight: '10px' }}>
            <InlineSwitch value={compactMode} onChange={() => setCompactMode(!compactMode)} label="Compact" showLabel={true} />
            {hasSimulatedItems && (
              <div style={{ marginLeft: '10px' }}>
                <InlineSwitch value={!noSimulations} onChange={() => setNoSimulations(!noSimulations)} label="Simulated" showLabel={true} />
              </div>
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
              key={item.thingId} thing={item} isEditor={userIsEditor}
              isCompact={compactMode} styles={styles} parentId={parentId} isType={isType}
              onDelete={(id: any) => setDeleteModalId(id)} resourceRoot={resourceRoot}
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
