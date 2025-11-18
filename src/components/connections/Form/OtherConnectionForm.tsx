// src/components/ConnectionForm/components/OtherConnectionForm.tsx
import React from 'react'
import { CodeEditor, useTheme2 } from '@grafana/ui'

interface Props {
    jsonOtherConnection: any
    setJsonOtherConnection: (json: any) => void
}

export const OtherConnectionForm: React.FC<Props> = ({ jsonOtherConnection, setJsonOtherConnection }) => {
    const bgcolor = useTheme2().colors.background.secondary

    return (
        <div style={{ backgroundColor: bgcolor, padding: '30px', marginBottom: '10px' }}>
            <h4> Connection definition </h4>
            <hr />
            <CodeEditor value={JSON.stringify(jsonOtherConnection, null, '\t')} language='json' height={600}
                onBlur={(c) => setJsonOtherConnection(JSON.parse(c))}
                showLineNumbers={true}
                showMiniMap={false}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            />
        </div>
    )
}
