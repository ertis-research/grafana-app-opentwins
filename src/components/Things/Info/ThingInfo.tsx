import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IDittoThing } from 'utils/interfaces/dittoThing';
import { capitalize, defaultIfNoExist } from 'utils/auxFunctions/general';
import { basicAttributesConst, linkAttributes } from 'utils/data/consts';
import { useStyles2, Icon, Input } from '@grafana/ui';
import { getStyles } from './ThingInfo.styles';

interface Parameters {
    thingInfo: IDittoThing;
    isType?: boolean;
}

export function ThingInfo({ thingInfo, isType = false }: Parameters) {
    const styles = useStyles2(getStyles);
    const [searchQuery, setSearchQuery] = useState("");
    const history = useHistory();
    const { url } = useRouteMatch();
    
    const resourceSegment = isType ? 'types' : 'twins';
    const resourceRoot = url.split(`/${resourceSegment}`)[0] + `/${resourceSegment}`;

    const handleParentClick = (parentId: string) => {
        history.push(`${resourceRoot}/${parentId}`);
    };

    // --- RENDER VALUE ---
    // Aquí es donde comprobamos la "key" original para saber cómo pintar el dato
    const renderValue = (key: string, value: any) => {
        if (value === null || value === undefined) { return "-" };

        // Al usar 'renderKey' en el DataCell, ahora 'key' volverá a ser '_parents'
        if (linkAttributes.includes(key)) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '4px' }}>
                    <div
                        onClick={() => handleParentClick(value)}
                        className={styles.parentLink}
                        role="button"
                        tabIndex={0}
                        title={`Go to twin: ${value}`}
                    >
                        <Icon name="cube" size="xs" />
                        <span>{value}</span>
                    </div>
                </div>
            );
        }

        if (typeof value === 'boolean') { return value ? "True" : "False" };
        if (typeof value === 'object') { return JSON.stringify(value) };
        return String(value);
    };

    // --- DATA CELL ---
    // He añadido 'renderKey?'. Si existe, se usa para la lógica. Si no, usa el label.
    const DataCell = ({ label, value, renderKey }: { label: string, value: any, renderKey?: string }) => (
        <div className={styles.kvContainer}>
            <span className={styles.kvLabel}>{capitalize(label)}</span>
            <div className={styles.kvValue}>{renderValue(renderKey || label, value)}</div>
        </div>
    );

    // --- FEATURES SECTION ---
    const renderFeatures = () => {
        const features = defaultIfNoExist(thingInfo, "features", {});
        const allFeatureKeys = Object.keys(features);

        const filteredKeys = allFeatureKeys.filter(featureId => {
            if (!searchQuery) { return true };
            const lowerQuery = searchQuery.toLowerCase();
            const featureData = features[featureId];
            const properties = featureData.properties || featureData;

            if (featureId.toLowerCase().includes(lowerQuery)) { return true };
            if (properties) {
                return Object.entries(properties).some(([key, value]) => {
                    const valStr = value !== null && value !== undefined ? String(value) : "";
                    return key.toLowerCase().includes(lowerQuery) || valStr.toLowerCase().includes(lowerQuery);
                });
            }
            return false;
        });

        if (allFeatureKeys.length === 0) {
            return <div className={styles.kvValue} style={{ padding: '10px' }}>No dynamic features available.</div>;
        }

        if (filteredKeys.length === 0) {
            return <div className={styles.kvValue} style={{ padding: '10px', fontStyle: 'italic' }}>No features match your search.</div>;
        }

        return (
            <div>
                {filteredKeys.map((featureId) => {
                    const featureData = features[featureId];
                    const properties = featureData.properties || featureData;
                    const hasProps = properties && Object.keys(properties).length > 0;

                    return (
                        <div key={featureId} className={styles.featureCard}>
                            <div className={styles.featureHeader}>
                                <Icon name="bolt" size="sm" style={{ opacity: 0.7 }} />
                                <span>{featureId}</span>
                            </div>
                            <div className={styles.propertiesGrid}>
                                {hasProps ? (
                                    Object.keys(properties).map((propKey) => (
                                        <DataCell key={propKey} label={propKey} value={properties[propKey]} />
                                    ))
                                ) : (
                                    <span className={styles.kvLabel}>No data</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- ATTRIBUTES SECTION ---
    const renderAttributes = () => {
        let thingAttributes = { ...defaultIfNoExist(thingInfo, "attributes", {}) };

        if (isType) {
            delete thingAttributes._parents;
        }

        for (let key in thingAttributes) {
            const isInternal = key.startsWith("_") && key !== '_parents';
            if (thingAttributes.hasOwnProperty(key) && (isInternal || basicAttributesConst.includes(key))) {
                delete thingAttributes[key];
            }
        }

        return (
            <div className={styles.propertiesGrid} style={{ gridTemplateColumns: '1fr' }}>
                <DataCell label="Name" value={thingInfo.attributes?.name} />
                <DataCell label="Description" value={thingInfo.attributes?.description} />
                <DataCell label="Policy ID" value={thingInfo.policyId} />

                {/* CORRECCIÓN AQUI: */}
                {/* Pasamos renderKey="_parents" explícitamente para que renderValue detecte la lógica especial */}
                {thingAttributes._parents && (
                    <DataCell
                        label="Inheritance (Parents)"
                        value={thingAttributes._parents}
                        renderKey="_parents"
                    />
                )}



                {Object.keys(thingAttributes).map(key => {
                    if (['name', 'description', '_parents'].includes(key)) { return null };
                    return <DataCell key={key} label={key} value={thingAttributes[key]} />;
                })}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.columnCard}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.titleText}>Attributes</h3>
                    <span className={styles.subTitleText}>Static Data</span>
                </div>
                {renderAttributes()}
            </div>

            <div className={styles.columnCard}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.titleText}>Features</h3>
                    <span className={styles.subTitleText}>Dynamic Data</span>
                </div>

                <div className={styles.searchContainer}>
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                        placeholder="Filter features..."
                        prefix={<Icon name="search" />}
                    />
                </div>

                {renderFeatures()}
            </div>
        </div>
    );
}
