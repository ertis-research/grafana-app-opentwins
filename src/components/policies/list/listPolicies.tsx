import { CheckBySelect } from 'components/general/checkBySelect';
import React from 'react';
/*import { List } from '@grafana/ui';
import { ControlledCollapse } from '@grafana/ui';
import { Select, TextArea, Button } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';*/

interface parameters {
    path : string
}

export const ListPolicies = ({path} : parameters) => {

    const policies = [
        {label: 'default', value: 1, text: '{\n"entries": {\n"DEFAULT": {\n"subjects": {\n"{{ request:subjectId }}": {\n"type": "Ditto user authenticated via nginx"\n}\n},\n"resources": {\n"thing:/": {\n"grant": ["READ", "WRITE"],\n"revoke": []\n},\n"policy:/": {\n"grant": ["READ", "WRITE"],\n"revoke": []\n},\n"message:/": {\n"grant": ["READ", "WRITE"],\n"revoke": []\n}\n}\n},\n"HONO": {\n"subjects": {\n"pre-authenticated:hono-connection": {\n"type": "Connection to Eclipse Hono"\n}\n},\n"resources": {\n"thing:/": {\n"grant": ["READ", "WRITE"],\n"revoke": []\n},\n"message:/": {\n"grant": ["READ", "WRITE"],\n"revoke": []\n}\n}\n}\n}\n}'},
        {label: 'politica1', value: 2, text: '"attributes": {\n\t"location": "Spain"\n},\n"features": {\n\t"temperature": {\n\t\t"properties": {\n\t\t\t"value": null\n\t\t}\n\t},\n\t"humidity": {\n\t\t"properties": {\n\t\t\t"value": null\n\t\t}\n\t}\n}'},
        {label: 'politica2', value: 3, text:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa as a a a a a aaa a a a aa Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'}
    ]
    
    return (
        <CheckBySelect path={path} tab="policies" name="policy" values={policies}/>
    )
}