// src/components/ConnectionForm/components/OtherConnectionForm.tsx
import React from 'react'
import { CodeEditor } from '@grafana/ui'

interface Props {
    jsonOtherConnection: any
    setJsonOtherConnection: (json: any) => void
}

export const OtherConnectionForm: React.FC<Props> = ({ jsonOtherConnection, setJsonOtherConnection }) => {
    // Eliminado: useTheme2 y bgcolor

    return (
        <div style={{ width: '100%', marginBottom: '10px' }}>
            <h4> Connection definition </h4>
            <hr style={{ marginBottom: '20px' }} />
            
            <CodeEditor 
                value={JSON.stringify(jsonOtherConnection, null, '\t')} 
                language='json' 
                height={600}
                width="100%" // Asegura que ocupe todo el ancho del panel padre
                onBlur={(c) => {
                    try {
                        setJsonOtherConnection(JSON.parse(c))
                    } catch (error) {
                        console.error("Invalid JSON entered", error);
                    }
                }}
                showLineNumbers={true}
                showMiniMap={false}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            />
        </div>
    )
}
