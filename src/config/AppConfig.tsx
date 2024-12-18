import React, { useState, ChangeEvent } from 'react';
import { lastValueFrom } from 'rxjs';
import { Button, Field, Input, FieldSet, useTheme2 } from '@grafana/ui';
import { PluginConfigPageProps, AppPluginMeta, PluginMeta } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

export type JsonData = {
    dittoURL?: string;
    extendedURL?: string;
    agentsURL?: string;
    agentsContext?: string;
    dittoUsername?: string;
    dittoPassword?: string;
};

type State = {
    dittoURL: string;
    extendedURL: string;
    agentsURL?: string;
    agentsContext?: string;
    dittoUsername?: string;
    dittoPassword?: string;
};

interface Props extends PluginConfigPageProps<AppPluginMeta<JsonData>> { }

export const AppConfig = ({ plugin }: Props) => {
    const { enabled, pinned, jsonData } = plugin.meta;
    const [state, setState] = useState<State>({
        dittoURL: (jsonData && jsonData.dittoURL) ? jsonData.dittoURL : '',
        extendedURL: (jsonData && jsonData.extendedURL) ? jsonData.extendedURL : '',
        agentsURL: (jsonData && jsonData.agentsURL) ? jsonData.agentsURL : '',
        agentsContext: (jsonData && jsonData.agentsContext) ? jsonData.agentsContext : '',
        dittoUsername: (jsonData && jsonData.dittoUsername) ? jsonData.dittoUsername : '',
        dittoPassword: (jsonData && jsonData.dittoPassword) ? jsonData.dittoPassword : ''
    });

    console.log(state)

    const onChangeDittoURL = (event: ChangeEvent<HTMLInputElement>) => {
        let url = event.target.value
        if (url.endsWith("/")) { 
            event.target.value.slice(0, -1)
        }
        setState({
            ...state,
            dittoURL: url.trim(),
        });
    };

    const onChangeExtendedAPI = (event: ChangeEvent<HTMLInputElement>) => {
        let url = event.target.value
        if (url.endsWith("/")) { 
            event.target.value.slice(0, -1)
        }
        setState({
            ...state,
            extendedURL: url.trim(),
        });
    };

    const onChangeAgentsAPI = (event: ChangeEvent<HTMLInputElement>) => {
        let url = event.target.value
        if (url.endsWith("/")) { 
            event.target.value.slice(0, -1)
        }
        setState({
            ...state,
            agentsURL: url.trim(),
        });
    };

    const onChangeAgentsContext = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            agentsContext: event.target.value.trim(),
        });
    };

    const onChangeDittoUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            dittoUsername: event.target.value.trim(),
        });
    };

    const onChangeDittoPassword = (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            dittoPassword: event.target.value.trim(),
        });
    };

    return (
        <div>
            {/* ENABLE / DISABLE PLUGIN */}
            <FieldSet label="Enable / Disable">
                {!enabled && (
                    <>
                        <div className={useTheme2().colors.text.secondary}>The plugin is currently not enabled.</div>
                        <Button
                            className={useTheme2().spacing(3)}
                            variant="primary"
                            onClick={() =>
                                updatePluginAndReload(plugin.meta.id, {
                                    enabled: true,
                                    pinned: true,
                                    jsonData,
                                })
                            }
                        >
                            Enable plugin
                        </Button>
                    </>
                )}

                {/* Disable the plugin */}
                {enabled && (
                    <>
                        <div className={useTheme2().colors.text.secondary}>The plugin is currently enabled.</div>
                        <Button
                            className={useTheme2().spacing(3)}
                            variant="destructive"
                            onClick={() =>
                                updatePluginAndReload(plugin.meta.id, {
                                    enabled: false,
                                    pinned: false,
                                    jsonData,
                                })
                            }
                        >
                            Disable plugin
                        </Button>
                    </>
                )}
            </FieldSet>

            {/* CUSTOM SETTINGS */}
            <FieldSet label="API Settings" className={useTheme2().spacing(6)}>
                {/* API Key */}
                <Field label="Eclipse Ditto URL" description="" required>
                    <Input
                        width={60}
                        required
                        id="dittoURL"
                        value={state.dittoURL}
                        placeholder={`E.g.: http://mywebsite.com/api/v1`}
                        onChange={onChangeDittoURL}
                    />
                </Field>

                <Field label="Eclipse Ditto Extended API URL" description="" required>
                    <Input
                        width={60}
                        id="extendedURL"
                        required
                        value={state.extendedURL}
                        placeholder={`E.g.: http://mywebsite.com/api/v1`}
                        onChange={onChangeExtendedAPI}
                    />
                </Field>

                {/* API Url */}
                <Field label="Ditto username" description="" className={useTheme2().spacing(3)} required>
                    <Input
                        width={60}
                        id="dittoUsername"
                        value={state.dittoUsername}
                        placeholder={`E.g.: http://mywebsite.com/api/v1`}
                        onChange={onChangeDittoUsername}
                        required
                    />
                </Field>

                <Field label="Ditto password" description="" required>
                    <Input
                        width={60}
                        id="dittoURL"
                        value={state.dittoPassword}
                        placeholder={'Your secret API key'}
                        onChange={onChangeDittoPassword}   
                        required         
                    />
                </Field>

                <Field label="Agents API URL" description="OPTIONAL (Beta functionality)">
                    <Input
                        width={60}
                        id="agentsURL"
                        value={state.agentsURL}
                        placeholder={`E.g.: http://mywebsite.com`}
                        onChange={onChangeAgentsAPI}
                    />
                </Field>

                <Field label="Agents context" description="OPTIONAL (Beta functionality)">
                    <Input
                        width={60}
                        id="agentsContext"
                        value={state.agentsContext}
                        onChange={onChangeAgentsContext}
                    />
                </Field>

                <div className={useTheme2().spacing(3)}>
                    <Button
                        type="submit"
                        onClick={() =>
                            updatePluginAndReload(plugin.meta.id, {
                                enabled,
                                pinned,
                                jsonData: {
                                    dittoURL: state.dittoURL,
                                    extendedURL: state.extendedURL,
                                    dittoUsername: state.dittoUsername,
                                    dittoPassword: state.dittoPassword,
                                    agentsURL: state.agentsURL,
                                    agentsContext: state.agentsContext
                                }
                            })
                        }
                        disabled={Boolean(!state.dittoURL || !state.dittoPassword || !state.dittoUsername || !state.extendedURL)}
                    >
                        Save settings
                    </Button>
                </div>
            </FieldSet>
        </div>
    );
};

const updatePluginAndReload = async (pluginId: string, data: Partial<PluginMeta<JsonData>>) => {
    try {
        await updatePlugin(pluginId, data);

        // Reloading the page as the changes made here wouldn't be propagated to the actual plugin otherwise.
        // This is not ideal, however unfortunately currently there is no supported way for updating the plugin state.
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
