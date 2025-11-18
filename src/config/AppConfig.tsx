import React, { useState, ChangeEvent } from 'react';
import { lastValueFrom } from 'rxjs';
import { Button, Field, Input, FieldSet, useTheme2 } from '@grafana/ui';
import { PluginConfigPageProps, AppPluginMeta, PluginMeta } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

// --- Types ---

export type JsonData = {
    dittoURL?: string;
    extendedURL?: string;
    agentsURL?: string;
    agentsContext?: string;
    dittoUsername?: string;
    dittoPassword?: string;
    dittoDevopsUsername?: string;
    dittoDevopsPassword?: string;
};

interface Props extends PluginConfigPageProps<AppPluginMeta<JsonData>> { }

// --- Components ---

export const AppConfig = ({ plugin }: Props) => {
    const { enabled, pinned, jsonData } = plugin.meta;
    const theme = useTheme2();

    // Initialize state directly from jsonData or defaults
    const [settings, setSettings] = useState<JsonData>({
        dittoURL: jsonData?.dittoURL || '',
        extendedURL: jsonData?.extendedURL || '',
        agentsURL: jsonData?.agentsURL || '',
        agentsContext: jsonData?.agentsContext || '',
        dittoUsername: jsonData?.dittoUsername || '',
        dittoPassword: jsonData?.dittoPassword || '',
        dittoDevopsUsername: jsonData?.dittoDevopsUsername || '',
        dittoDevopsPassword: jsonData?.dittoDevopsPassword || ''
    });

    // Optimized generic change handler
    const handleChange = (key: keyof JsonData) => (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.trim();

        // Automatic trailing slash removal for URL fields
        if ((key === 'dittoURL' || key === 'extendedURL' || key === 'agentsURL') && value.endsWith('/')) {
            value = value.slice(0, -1);
        }

        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const isSettingsValid = Boolean(
        settings.dittoURL &&
        settings.dittoPassword &&
        settings.dittoUsername &&
        settings.extendedURL
    );

    const onSave = () => {
        updatePluginAndReload(plugin.meta.id, {
            enabled,
            pinned,
            jsonData: settings,
        });
    };

    const onTogglePlugin = (shouldEnable: boolean) => {
        updatePluginAndReload(plugin.meta.id, {
            enabled: shouldEnable,
            pinned: shouldEnable,
            jsonData,
        });
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            {/* ENABLE / DISABLE PLUGIN */}
            <FieldSet label="Plugin Status">
                <div style={{ marginBottom: theme.spacing(2) }}>
                    <div className={theme.colors.text.secondary} style={{ marginBottom: theme.spacing(1) }}>
                        {enabled ? 'The plugin is currently enabled.' : 'The plugin is currently not enabled.'}
                    </div>
                    <Button
                        variant={enabled ? 'destructive' : 'primary'}
                        onClick={() => onTogglePlugin(!enabled)}
                    >
                        {enabled ? 'Disable Plugin' : 'Enable Plugin'}
                    </Button>
                </div>
            </FieldSet>

            {/* CUSTOM SETTINGS */}
            <FieldSet label="API Settings" className={theme.spacing(4)}>

                {/* Eclipse Ditto URLs */}
                <Field label="Eclipse Ditto URL" description="Base API URL" required>
                    <Input
                        width={60}
                        id="dittoURL"
                        value={settings.dittoURL}
                        placeholder="E.g.: http://mywebsite.com/api/v1"
                        onChange={handleChange('dittoURL')}
                    />
                </Field>

                <Field label="Eclipse Ditto Extended API URL" description="Extended API Endpoint" required>
                    <Input
                        width={60}
                        id="extendedURL"
                        value={settings.extendedURL}
                        placeholder="E.g.: http://mywebsite.com/api/v1"
                        onChange={handleChange('extendedURL')}
                    />
                </Field>

                {/* Credentials - Standard */}
                <Field label="Ditto Username" className={theme.spacing(3)} required>
                    <Input
                        width={60}
                        id="dittoUsername"
                        value={settings.dittoUsername}
                        placeholder="Your ditto user"
                        onChange={handleChange('dittoUsername')}
                    />
                </Field>

                <Field label="Ditto Password" required>
                    <Input
                        width={60}
                        type="password"
                        id="dittoPassword"
                        value={settings.dittoPassword}
                        placeholder="Your ditto password"
                        onChange={handleChange('dittoPassword')}
                    />
                </Field>

                {/* Credentials - DevOps */}
                <Field label="Ditto DevOps Username" className={theme.spacing(3)} required>
                    <Input
                        width={60}
                        id="dittoDevopsUsername"
                        value={settings.dittoDevopsUsername}
                        placeholder="Your ditto devops user"
                        onChange={handleChange('dittoDevopsUsername')}
                    />
                </Field>

                <Field label="Ditto DevOps Password" required>
                    <Input
                        width={60}
                        type="password"
                        id="dittoDevopsPassword"
                        value={settings.dittoDevopsPassword}
                        placeholder="Your ditto devops password"
                        onChange={handleChange('dittoDevopsPassword')}
                    />
                </Field>

                {/* Beta Functionality */}
                <Field label="Agents API URL" description="OPTIONAL (Beta functionality)" className={theme.spacing(3)}>
                    <Input
                        width={60}
                        id="agentsURL"
                        value={settings.agentsURL}
                        placeholder="E.g.: http://mywebsite.com"
                        onChange={handleChange('agentsURL')}
                    />
                </Field>

                <Field label="Agents Context" description="OPTIONAL (Beta functionality)">
                    <Input
                        width={60}
                        id="agentsContext"
                        value={settings.agentsContext}
                        onChange={handleChange('agentsContext')}
                    />
                </Field>

                <div className={theme.spacing(3)}>
                    <Button
                        type="submit"
                        onClick={onSave}
                        disabled={!isSettingsValid}
                    >
                        Save Settings
                    </Button>
                </div>
            </FieldSet>
        </div>
    );
};

// --- Helpers ---

const updatePluginAndReload = async (pluginId: string, data: Partial<PluginMeta<JsonData>>) => {
    try {
        await updatePlugin(pluginId, data);
        // Reloading is required to propagate changes to the plugin state in the current architecture.
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
