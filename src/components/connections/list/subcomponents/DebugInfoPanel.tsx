import { Button, TextArea } from '@grafana/ui'
import React from 'react'
import { DynamicInfo } from 'utils/interfaces/others'

interface DebugInfoPanelProps {
    title: string;
    data?: DynamicInfo;
    isLoading: boolean;
    onLoad: () => void;
    onRefresh?: () => void;
    showRefresh?: boolean;
}

export const DebugInfoPanel: React.FC<DebugInfoPanelProps> = ({ title, data, isLoading, onLoad, onRefresh, showRefresh = false }) => {
    const buttonIcon = isLoading ? "spinner" : "history";
    const refreshIcon = isLoading ? "spinner" : "sync";
    const timestamp = data?.timestamp ? new Date(data.timestamp).toLocaleString() : null;
    const content = data?.text ? JSON.stringify(data.text, undefined, 2) : "";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h6 style={{ margin: 0, fontWeight: 500 }}>{title}</h6>
                {timestamp && (
                     <span style={{ fontSize: '10px', color: '#888' }}>{timestamp}</span>
                )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <Button
                    style={{ flexGrow: 1 }}
                    variant='secondary'
                    size="sm"
                    disabled={isLoading}
                    icon={buttonIcon}
                    onClick={onLoad}
                >
                    Load
                </Button>
                {showRefresh && (
                    <Button
                        variant='secondary'
                        size="sm"
                        disabled={isLoading}
                        icon={refreshIcon}
                        onClick={onRefresh}
                    >
                        Reset
                    </Button>
                )}
            </div>

            <TextArea 
                rows={15} 
                value={content} 
                readOnly 
                style={{ flexGrow: 1, fontFamily: 'monospace', fontSize: '11px', minHeight: '550px' }} 
            />
        </div>
    );
}
