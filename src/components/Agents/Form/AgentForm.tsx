import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { Button, Field, Form, Input, MultiSelect, RadioButtonGroup, TextArea, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';

import { AgentFormProps, FormatOptions } from './AgentForm.types';
import { useAgentForm } from './useAgentForm';

export function AgentForm({ id }: AgentFormProps) {
    const styles = useStyles2(getStyles);
    
    // Usamos el hook para toda la lógica
    const {
        agent,
        availableTwins,
        selectedTwins,
        setSelectedTwins,
        selectedFormat,
        setSelectedFormat,
        hasSetContext,
        validateString,
        handleInputChange,
        handleSubmit,
        goBackToList
    } = useAgentForm(id);

    return (
        <div className={styles.centeredWrapper}>
            <div className={styles.formPanel}>
                
                {/* Header Section */}
                <div className={styles.header}>
                    <h2>Create New Agent</h2>
                    <Button variant="secondary" fill="outline" icon="arrow-left" onClick={goBackToList}>
                        Back to list
                    </Button>
                </div>

                {/* Form Section */}
                <Form onSubmit={handleSubmit} className={styles.formContainer}>
                    {({ register, errors }) => (
                        <>
                            <Field
                                label="Context"
                                description="The namespace/grouping for the agent."
                                required
                                disabled={hasSetContext}
                                invalid={!!validateString(agent.namespace)}
                                error={validateString(agent.namespace) || ''}
                            >
                                <Input
                                    {...register("namespace", { required: !hasSetContext })}
                                    value={agent.namespace}
                                    onChange={(e) => handleInputChange(e, 'namespace')}
                                    placeholder="e.g. production-floor"
                                />
                            </Field>

                            <Field
                                label="Identifier"
                                description="Unique identifier for the agent (lowercase, no spaces)."
                                required
                                invalid={!!validateString(agent.id)}
                                error={validateString(agent.id) || ''}
                            >
                                <Input
                                    {...register("id", { required: true })}
                                    value={agent.id}
                                    onChange={(e) => handleInputChange(e, 'id')}
                                    placeholder="e.g. agent-001"
                                />
                            </Field>

                            <Field
                                label="Name"
                                description="Readable name (no spaces allowed)."
                                required
                                invalid={agent.name.includes(" ")}
                                error={agent.name.includes(" ") ? "Blank spaces are not allowed" : ""}
                            >
                                <Input
                                    {...register("name", { required: true })}
                                    value={agent.name}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                    placeholder="e.g. MyAgent"
                                />
                            </Field>

                            <Field
                                label="Related Digital Twins"
                                description="Optional: Link this agent to specific digital twins."
                            >
                                <MultiSelect
                                    options={availableTwins}
                                    value={selectedTwins}
                                    onChange={setSelectedTwins}
                                    placeholder="Select twins..."
                                />
                            </Field>

                            <div className={styles.editorSection}>
                                <Field
                                    label="Definition Format"
                                    description="Choose the format for your Kubernetes definition."
                                >
                                    <RadioButtonGroup
                                        options={FormatOptions}
                                        value={selectedFormat.value}
                                        onChange={(v) => setSelectedFormat({ label: v, value: v })}
                                    />
                                </Field>

                                <Field
                                    label="Kubernetes Definition"
                                    description="Deployment or CronJob definition."
                                    required
                                    className={styles.flexField} // Para que crezca
                                >
                                    <TextArea
                                        {...register("data", { required: true })}
                                        value={agent.data}
                                        onChange={(e) => handleInputChange(e, 'data')}
                                        className={styles.textArea}
                                        placeholder={`Paste your ${selectedFormat.value} here...`}
                                    />
                                </Field>
                            </div>

                            <div className={styles.buttonGroup}>
                                <Button variant="primary" type="submit">
                                    Create Agent
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

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
    editorSection: css`
        margin-top: ${theme.spacing(2)};
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `,
    flexField: css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    `,
    textArea: css`
        font-family: ${theme.typography.fontFamilyMonospace};
        min-height: 400px;
        resize: vertical;
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
