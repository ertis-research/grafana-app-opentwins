import React, { useState, ChangeEvent } from 'react';
import { lastValueFrom } from 'rxjs';
import { css } from '@emotion/css';
import { Button, Field, Input, SecretInput, useTheme2, Alert, HorizontalGroup, VerticalGroup, Badge } from '@grafana/ui';
import { PluginConfigPageProps, AppPluginMeta, PluginMeta, GrafanaTheme2 } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

// --- Types ---

export type JsonData = {
    dittoURL?: string;
    extendedURL?: string;
    agentsURL?: string;
    agentsContext?: string;
    dittoUsername?: string;
    dittoDevopsUsername?: string;
};

export type MySecureJsonData = {
    dittoPassword?: string;
    dittoBasicAuth?: string;
    dittoDevopsPassword?: string;
    dittoDevopsBasicAuth?: string;
};

type MySecureJsonDataFlags = {
    [K in keyof MySecureJsonData]?: boolean;
};

// --- 2. Truco para Tipado Fuerte en App Plugins ---
// Extendemos la interfaz para decirle a TS que secureJsonData tiene nuestros flags específicos
interface MyPluginMeta extends AppPluginMeta<JsonData> {
    secureJsonData?: MySecureJsonDataFlags;
}

export interface Props extends PluginConfigPageProps<MyPluginMeta> { }

// --- Styles ---
const getStyles = (theme: GrafanaTheme2) => ({
    container: css`
        padding-bottom: ${theme.spacing(4)};
    `,
    sectionCard: css`
        background: ${theme.colors.background.secondary};
        padding: ${theme.spacing(3)};
        border-radius: ${theme.shape.borderRadius()};
        margin-bottom: ${theme.spacing(3)};
        border: 1px solid ${theme.colors.border.weak};
    `,
    sectionTitle: css`
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.fontWeightMedium};
        margin-bottom: ${theme.spacing(1)};
        color: ${theme.colors.text.primary};
    `,
    sectionDescription: css`
        color: ${theme.colors.text.secondary};
        margin-bottom: ${theme.spacing(3)};
        font-size: ${theme.typography.bodySmall.fontSize};
    `,
    subTitle: css`
        font-size: ${theme.typography.h5.fontSize};
        margin-top: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
        color: ${theme.colors.text.primary};
        border-bottom: 1px solid ${theme.colors.border.weak};
        padding-bottom: ${theme.spacing(1)};
    `,
    actionBar: css`
        margin-top: ${theme.spacing(4)};
        display: flex;
        justify-content: space-between;
        align-items: center;
    `
});

// --- Component ---

const AppConfig = ({ plugin }: Props) => {
    const { enabled, pinned, jsonData, secureJsonFields } = plugin.meta;
    const theme = useTheme2();
    const styles = getStyles(theme);

    console.log('Secure Data Flags:', secureJsonFields);

    const [settings, setSettings] = useState<JsonData>({
        dittoURL: jsonData?.dittoURL || '',
        extendedURL: jsonData?.extendedURL || '',
        agentsURL: jsonData?.agentsURL || '',
        agentsContext: jsonData?.agentsContext || '',
        dittoUsername: jsonData?.dittoUsername || '',
        dittoDevopsUsername: jsonData?.dittoDevopsUsername || '',
    });

    const [secureSettings, setSecureSettings] = useState<MySecureJsonData>({});
    
    const [initialUsernames] = useState({
        ditto: jsonData?.dittoUsername || '',
        devops: jsonData?.dittoDevopsUsername || ''
    });

    const isDittoAuthDesync = settings.dittoUsername !== initialUsernames.ditto && !secureSettings.dittoPassword;
    const isDevopsAuthDesync = settings.dittoDevopsUsername !== initialUsernames.devops && !secureSettings.dittoDevopsPassword;

    // Handlers
    const handleChange = (key: keyof JsonData) => (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.trim();
        if ((key === 'dittoURL' || key === 'extendedURL' || key === 'agentsURL') && value.endsWith('/')) {
            value = value.slice(0, -1);
        }
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const onSecretChange = (key: keyof MySecureJsonData) => (event: ChangeEvent<HTMLInputElement>) => {
        setSecureSettings((prev) => ({ ...prev, [key]: event.target.value }));
    };

    const onResetSecret = (key: keyof MySecureJsonData) => {
        setSecureSettings((prev) => ({ ...prev, [key]: '' }));
    };

    // Validation Logic
    const isSettingsValid = Boolean(
        settings.dittoURL &&
        settings.extendedURL &&
        settings.dittoUsername &&
        ((secureJsonFields?.dittoPassword && !isDittoAuthDesync) || secureSettings.dittoPassword)
    );

    // Save & Toggle Logic
    const onSave = () => {
        const finalSecureJsonData: MySecureJsonData = { ...secureSettings };

        if (settings.dittoUsername && secureSettings.dittoPassword) {
            finalSecureJsonData.dittoBasicAuth = btoa(`${settings.dittoUsername}:${secureSettings.dittoPassword}`);
        }

        if (settings.dittoDevopsUsername && secureSettings.dittoDevopsPassword) {
            finalSecureJsonData.dittoDevopsBasicAuth = btoa(`${settings.dittoDevopsUsername}:${secureSettings.dittoDevopsPassword}`);
        }

        updatePluginAndReload(plugin.meta.id, {
            enabled,
            pinned,
            jsonData: settings,
            secureJsonData: finalSecureJsonData,
        });
    };

    const onTogglePlugin = (shouldEnable: boolean) => {
        updatePluginAndReload(plugin.meta.id, {
            enabled: shouldEnable,
            pinned: shouldEnable,
            jsonData: settings,
        });
    };

    return (
        <div className={styles.container}>
            
            {/* HEADER & STATUS */}
            <div style={{ marginBottom: theme.spacing(4) }}>
                <Alert 
                    title={enabled ? "Plugin Enabled" : "Plugin Disabled"} 
                    severity={enabled ? "success" : "warning"}
                >
                    {enabled 
                        ? "The Ditto integration is active and ready to use." 
                        : "Enable this plugin to start interacting with your Eclipse Ditto instance."}
                    <div style={{ marginTop: theme.spacing(2) }}>
                        <Button
                            size="sm"
                            variant={enabled ? 'secondary' : 'primary'}
                            onClick={() => onTogglePlugin(!enabled)}
                        >
                            {enabled ? 'Disable Plugin' : 'Enable Plugin'}
                        </Button>
                    </div>
                </Alert>
            </div>

            {/* SECTION 1: CONNECTIVITY */}
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Connectivity</h3>
                <p className={styles.sectionDescription}>
                    Configure the endpoints for your Eclipse Ditto instance. These URLs will be used for all API requests.
                </p>

                <Field label="Eclipse Ditto URL" description="The base API URL for your Ditto instance." required>
                    <Input
                        width={60}
                        value={settings.dittoURL}
                        placeholder="https://ditto.example.com/api/2"
                        onChange={handleChange('dittoURL')}
                    />
                </Field>

                <Field label="Extended API URL" description="Endpoint for extended functionality or custom proxy." required>
                    <Input
                        width={60}
                        value={settings.extendedURL}
                        placeholder="https://ditto.example.com/api/extended"
                        onChange={handleChange('extendedURL')}
                    />
                </Field>
            </div>

            {/* SECTION 2: AUTHENTICATION */}
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Authentication</h3>
                <p className={styles.sectionDescription}>
                    Securely manage Eclipse Ditto credentials. Passwords are encrypted and stored securely within Grafana.
                </p>

                {/* Standard Role */}
                <div className={styles.subTitle}>Standard Access</div>
                <VerticalGroup spacing="none">
                    <Field label="Username" required>
                        <Input
                            width={40}
                            value={settings.dittoUsername}
                            onChange={handleChange('dittoUsername')}
                        />
                    </Field>
                    <Field label="Password" description="If changed, the Basic Auth token will be regenerated." invalid={isDittoAuthDesync} 
                        error={isDittoAuthDesync ? "Username changed. Please re-enter password to update the hash." : undefined} required>
                        <SecretInput
                            width={40}
                            value={secureSettings.dittoPassword}
                            isConfigured={Boolean(secureJsonFields?.dittoPassword)}
                            onChange={onSecretChange('dittoPassword')}
                            onReset={() => onResetSecret('dittoPassword')}
                        />
                    </Field>
                </VerticalGroup>

                {/* DevOps Role */}
                <div className={styles.subTitle} style={{ marginTop: theme.spacing(4) }}>DevOps Access</div>
                <VerticalGroup spacing="none">
                    <Field label="DevOps Username" required>
                        <Input
                            width={40}
                            value={settings.dittoDevopsUsername}
                            onChange={handleChange('dittoDevopsUsername')}
                        />
                    </Field>
                    <Field label="DevOps Password" description="If changed, the Basic Auth token will be regenerated." invalid={isDevopsAuthDesync}
                        error={isDevopsAuthDesync ? "Username changed. Please re-enter password." : undefined} required>
                        <SecretInput
                            width={40}
                            value={secureSettings.dittoDevopsPassword}
                            isConfigured={Boolean(secureJsonFields?.dittoDevopsPassword)}
                            onChange={onSecretChange('dittoDevopsPassword')}
                            onReset={() => onResetSecret('dittoDevopsPassword')}
                        />
                    </Field>
                </VerticalGroup>
            </div>

            {/* SECTION 3: EXPERIMENTAL */}
            <div className={styles.sectionCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Experimental Features</h3>
                    <Badge text="Beta" color="blue" />
                </div>
                <p className={styles.sectionDescription} style={{ marginTop: theme.spacing(1) }}>
                    Optional settings for Agents integration. Leave these empty if you are unsure.
                </p>

                <HorizontalGroup>
                    <Field label="Agents API URL" description="Optional endpoint for agents.">
                        <Input
                            width={40}
                            value={settings.agentsURL}
                            placeholder="https://agents.example.com"
                            onChange={handleChange('agentsURL')}
                        />
                    </Field>
                    <Field label="Agents Context" description="Context identifier.">
                        <Input
                            width={25}
                            value={settings.agentsContext}
                            onChange={handleChange('agentsContext')}
                        />
                    </Field>
                </HorizontalGroup>
            </div>

            {/* FOOTER ACTION */}
            <div className={styles.actionBar}>
                <span className={theme.colors.text.secondary}>
                    {(isDittoAuthDesync || isDevopsAuthDesync) 
                        ? 'Username modified: You must re-enter the password to generate a new token.' 
                        : (isSettingsValid ? 'Configuration looks good.' : 'Please fill in all required fields.')}
                </span>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={onSave}
                    disabled={!isSettingsValid}
                >
                    Save Configuration
                </Button>
            </div>
        </div>
    );
};

export default AppConfig;

// --- Helpers ---

const updatePluginAndReload = async (pluginId: string, data: Partial<PluginMeta<JsonData>>) => {
    try {
        await updatePlugin(pluginId, data);
        window.location.reload();
    } catch (e) {
        console.error('Error while updating the plugin', e);
    }
};

export const updatePlugin = async (pluginId: string, data: Partial<PluginMeta>) => {
    const response = await getBackendSrv().fetch({
        url: `/api/plugins/${pluginId}/settings`,
        method: 'POST',
        data,
    });
    return lastValueFrom(response);
};
