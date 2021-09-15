// Libraries
import React, { PureComponent, Fragment } from 'react';

// Types
import { PluginConfigPageProps, AppPluginMeta } from '@grafana/data';
import { ExampleAppSettings } from 'types';

interface Props extends PluginConfigPageProps<AppPluginMeta<ExampleAppSettings>> {}

export class GeneralPage extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <h3></h3>
      </Fragment>
    );
  }
}
