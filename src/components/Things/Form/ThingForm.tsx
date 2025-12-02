import React, { useState } from 'react';
import { AppPluginMeta, KeyValue, GrafanaTheme2 } from '@grafana/data';
import { IDittoThing, IDittoThingData } from 'utils/interfaces/dittoThing';
import { 
    Button, Field, Form, Input, Select, RadioButtonGroup, 
    Switch, useStyles2, Icon, TextArea, FieldSet
} from '@grafana/ui';
import { css } from '@emotion/css';

import { useThingForm } from './useThingForm';
import { AttributeList } from './subcomponents/AttributeList';
import { FeatureList } from './subcomponents/FeatureList';
import { enumOptions, options } from 'utils/data/consts';
import { useRouteMatch } from 'react-router-dom';

interface Parameters {
    parentId?: string;
    thingToEdit?: IDittoThing;
    isType: boolean;
    meta: AppPluginMeta<KeyValue<any>>;
    funcFromType?: any;
    funcFromZero: (thingId: string, data: IDittoThingData, num?: number) => Promise<any>;
}

export const ThingForm = ({ thingToEdit, isType, funcFromType, funcFromZero, parentId }: Parameters) => {
    const styles = useStyles2(getStyles);
    
    const FORM_ID = 'thing-form-id';

    const { url } = useRouteMatch();
    const resourcePath = thingToEdit ? "edit" : "new";
    const resourceRoot =  url.split(`/${resourcePath}`)[0] + (parentId ? isType ? "/hierarchy" : "/children" : "")
    

    // Estado para controlar la visualización del preview JSON (opcional)
    const [showPreview, setShowPreview] = useState(false);

    const {
        thingIdField, setThingIdField,
        policyId, setPolicyId,
        basicInfo, setBasicInfo,
        attributes, setAttributes,
        features, setFeatures,
        policies, types,
        creationMode, setCreationMode,
        selectedType, setSelectedType,
        customizeType, setCustomizeType,
        numChildren, setNumChildren,
        isLoading, saveThing, goBackToList,
        allowFromType, disableAdvancedFields, previewJson
    } = useThingForm({ thingToEdit, isType, funcFromType, funcFromZero, resourceRoot });

    const title = isType ? "Type" : "Twin";
    const headerTitle = thingToEdit 
        ? `Edit ${title}: ${thingToEdit.thingId}` 
        : `Create New ${title}`;

    const buttonText = isLoading
        ? (thingToEdit ? 'Updating...' : 'Creating...')
        : (thingToEdit ? 'Save Changes' : 'Create');
    const buttonIcon = isLoading ? "spinner" : undefined;

    return (
        <div className={styles.centeredWrapper}>
            <div className={styles.formPanel}>
                
                {/* Header Section */}
                <div className={styles.header}>
                    <div>
                        <h2>{headerTitle}</h2>
                        {parentId && 
                        (<div style={{ opacity: 0.7, fontSize: '0.9em' }}>Parent: {parentId}</div>)}
                    </div>
                    <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                        Back to list
                    </Button>
                </div>

                {/* Main Form */}
                <Form id={FORM_ID} onSubmit={saveThing} className={styles.formContainer}>
                    {({ register, errors }) => (
                        <>
                            {/* --- SECTION: IDENTIFICATION --- */}
                            <FieldSet label="Identification">
                                <div className={styles.flexRow}>
                                    <Field label="Namespace" required={!thingToEdit} className={styles.flexField}
                                            description={`Context for the ${title}.`}>
                                        <Input 
                                            value={thingIdField.namespace}
                                            onChange={e => setThingIdField({...thingIdField, namespace: e.currentTarget.value})}
                                            disabled={!!thingToEdit}
                                            placeholder="e.g. org.eclipse.ditto"
                                        />
                                    </Field>
                                    <Field label="ID" required={!thingToEdit} className={styles.flexField}
                                            description="Unique identifier (without namespace).">
                                        <Input 
                                            value={thingIdField.id}
                                            onChange={e => setThingIdField({...thingIdField, id: e.currentTarget.value})}
                                            disabled={!!thingToEdit}
                                            placeholder="my-thing-01"
                                        />
                                    </Field>
                                </div>
                                {isType && !thingToEdit && (
                                    <Field label="Number of children" description="Instances to create based on this type.">
                                        <Input type="number" value={numChildren} onChange={e => setNumChildren(Number(e.currentTarget.value))}/>
                                    </Field>
                                )}
                            </FieldSet>

                            {/* --- SECTION: STRATEGY (Only Create) --- */}
                            {allowFromType && (
                                <FieldSet label="Creation Strategy" className="mt-3">
                                    <div className="mb-3">
                                        <RadioButtonGroup options={options} fullWidth value={creationMode} onChange={v => setCreationMode(v!)} />
                                    </div>
                                    {creationMode === enumOptions.FROM_TYPE && (
                                        <div className={styles.subSection}>
                                            <Field label="Select Base Type" required>
                                                <Select 
                                                    options={types} 
                                                    value={selectedType} 
                                                    onChange={setSelectedType} 
                                                    prefix={<Icon name="layer-group"/>}
                                                />
                                            </Field>
                                            <Field label="Customize properties" description="Override properties from the selected type">
                                                <Switch value={customizeType} onChange={e => setCustomizeType(e.currentTarget.checked)} />
                                            </Field>
                                        </div>
                                    )}
                                </FieldSet>
                            )}

                            {/* --- SECTION: BASIC INFO --- */}
                            <div className="mt-1">
                                <h4>General Details</h4>
                                <p className={styles.sectionDesc}>General Details include essential information used to identify and describe the twin.</p>
                            
                                <Field label="Policy ID" required>
                                    <Select 
                                        options={policies} 
                                        value={policyId} 
                                        onChange={v => setPolicyId(v.value!)} 
                                        disabled={disableAdvancedFields}
                                    />
                                </Field>
                                <Field label="Name">
                                    <Input value={basicInfo.name} onChange={e => setBasicInfo({...basicInfo, name: e.currentTarget.value})}/>
                                </Field>
                                <Field label="Description">
                                    <Input value={basicInfo.description} onChange={e => setBasicInfo({...basicInfo, description: e.currentTarget.value})}/>
                                </Field>
                                <Field label="Image URL">
                                    <Input value={basicInfo.image} onChange={e => setBasicInfo({...basicInfo, image: e.currentTarget.value})}/>
                                </Field>
                            </div>

                            {/* --- SECTION: ATTRIBUTES & FEATURES --- */}
                            <div className="mt-4">
                                <h4>Attributes</h4>
                                <p className={styles.sectionDesc}>Attributes describe static characteristics of a twin and help identify it. Their values change rarely.</p>
                                
                                <div className={styles.editorSection}>
                                    <AttributeList 
                                        attributes={attributes} 
                                        setAttributes={setAttributes} 
                                        disabled={disableAdvancedFields} 
                                    />
                                    <div style={{ height: '20px' }}></div>
                                </div>
                                <h4>Features</h4>
                                <p className={styles.sectionDesc}>Features represent dynamic aspects of a twin, grouping data and functionality that change or operate over time.</p>
                                
                                <div className={styles.editorSection}>
                                    <FeatureList 
                                        features={features} 
                                        setFeatures={setFeatures} 
                                        disabled={disableAdvancedFields} 
                                    />
                                </div>
                            </div>

                            {/* --- PREVIEW TOGGLE (Opcional, para no ensuciar UI) --- */}
                            <div className="mt-4">
                                <Button variant="secondary" size="sm" fill="text" icon={showPreview ? "angle-up" : "angle-down"} onClick={() => setShowPreview(!showPreview)}>
                                    {showPreview ? "Hide JSON Preview" : "Show JSON Preview"}
                                </Button>
                                {showPreview && (
                                    <TextArea className={styles.textArea} value={previewJson} readOnly />
                                )}
                            </div>
                        </>
                    )}
                </Form>
                <div className={styles.buttonGroup}>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        form={FORM_ID} 
                        disabled={isLoading}
                        icon={buttonIcon}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Estilos consistentes con AgentForm
const getStyles = (theme: GrafanaTheme2) => ({
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
    `,
    flexRow: css`
        display: flex;
        gap: ${theme.spacing(2)};
        width: 100%;
    `,
    flexField: css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `,
    editorSection: css`
        margin-top: ${theme.spacing(2)};
        display: flex;
        flex-direction: column;
    `,
    subSection: css`
        padding: ${theme.spacing(2)};
        background: ${theme.colors.background.secondary};
        border-radius: ${theme.shape.borderRadius()};
        margin-bottom: ${theme.spacing(2)};
    `,
    sectionDesc: css`
        color: ${theme.colors.text.secondary};
        font-size: ${theme.typography.bodySmall.fontSize};
        margin-bottom: ${theme.spacing(2)};
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
    `
});
