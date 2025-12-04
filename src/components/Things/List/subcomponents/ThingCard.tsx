import React from 'react';
import { LinkButton } from '@grafana/ui';
import { useHistory } from 'react-router-dom';
import { defaultIfNoExist, imageIsUndefined } from 'utils/auxFunctions/general';
import { ThingCardProps } from '../ThingsList.types';

export const ThingCard: React.FC<ThingCardProps> = ({ thing, isEditor, isCompact, styles, parentId, onDelete, isType, resourceRoot }) => {
    const name = defaultIfNoExist(thing.attributes, "name", thing.thingId || '').trim();
    const description = defaultIfNoExist(thing.attributes, "description", "");
    const imageUrl = imageIsUndefined(defaultIfNoExist(thing.attributes, "image", undefined));

    const parentCount = (isType && parentId && thing.attributes?._parents?.[parentId])
        ? thing.attributes._parents[parentId]
        : null;

    const history = useHistory();

    const detailsUrl = `${resourceRoot}/${thing.thingId}`;
    const editUrl = `${resourceRoot}/${thing.thingId}/edit`;

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        history.push(detailsUrl);
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        history.push(editUrl);
    }
    // --- Modo Compacto (Solo texto, más pequeño) ---
    if (isCompact) {
        return (
            // Usamos col-md-4 col-lg-3 col-xl-2 para que sean PEQUEÑAS
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
                <div className={styles.compactCard}>
                    <div onClick={handleCardClick} className={styles.linkReset}>
                        <div>
                            <h6 className={styles.cardTitle} style={{ fontSize: '0.9rem' }}>{name}</h6>
                            <p className={styles.cardId} style={{ fontSize: '0.75rem' }}>{thing.thingId}</p>
                        </div>
                    </div>
                    {isEditor && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <LinkButton fill='text' variant='secondary' size="sm" icon="pen" tooltip="Edit" onClick={handleEditClick} />
                            <LinkButton fill='text' variant='destructive' size="sm" icon="trash-alt" tooltip="Delete" onClick={(e) => { e.preventDefault(); onDelete(thing.thingId); }} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- Modo Estandar ---
    return (
        // Usamos col-sm-6 col-md-4 col-lg-3 col-xl-2 para que quepan muchas y sean pequeñas
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
            <div className={styles.cardWrapper}>
                {/* 1. Imagen Superior */}
                <div className={styles.imageContainer}>
                    {parentCount && <div className={styles.parentBadge}>x{parentCount} children</div>}
                    <div onClick={handleCardClick} className={styles.linkReset}>
                        <img src={imageUrl} className={styles.image} alt={name} loading="lazy" />
                    </div>
                </div>

                {/* 2. Contenido Central */}
                <div className={styles.contentContainer}>
                    <div onClick={handleCardClick} className={styles.linkReset}>
                        <h5 className={styles.cardTitle}>{name}</h5>
                        <p className={styles.cardId} title={thing.thingId}>{thing.thingId}</p>
                        <p className={styles.cardDescription}>{description}</p>
                    </div>
                </div>

                {/* 3. Pie de acciones (Solo si es editor) */}
                {isEditor && (
                    <div className={styles.cardActions}>
                        <LinkButton fill='text' variant='secondary' size="sm" icon="pen" tooltip="Edit" onClick={handleEditClick} />
                        <LinkButton fill='text' variant='destructive' size="sm" icon="trash-alt" tooltip="Delete" onClick={(e) => { e.preventDefault(); onDelete(thing.thingId); }} />
                    </div>
                )}
            </div>
        </div>
    );
};
