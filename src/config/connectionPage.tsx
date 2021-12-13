// Libraries
import React, { PureComponent } from 'react';

// Types
import { PluginConfigPageProps, AppPluginMeta } from '@grafana/data';
import { ExampleAppSettings } from 'types';

interface Props extends PluginConfigPageProps<AppPluginMeta<ExampleAppSettings>> {}

export class ConnectionsPage extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
      switch (this.props.query["mode"]) {
        case "create":
          return (
            <div></div>
          );
        default:
          return (
            <div>Connections LIST</div>
          );
      }
  }
}
