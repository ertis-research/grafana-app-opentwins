import { ComponentClass } from 'react';
import { AppPlugin, AppRootProps } from '@grafana/data';
//import { ConnectionsPage } from './pages/connectionPage';
import { ExampleRootPage } from './ExampleRootPage';
import './css/bootstrap-grid.css';
//import './css/bootstrap-utilities.css';
//import './css/bootstrap.css';
import './css/bootstrap-cards.css';
import './css/bootstrap-basics.css';
import { AppConfig } from 'config/AppConfig';

//export { ExampleConfigCtrl as ConfigCtrl };

export const plugin = new AppPlugin<{}>()
  .setRootPage((ExampleRootPage as unknown) as ComponentClass<AppRootProps>)
/*  .addConfigPage({
    title: 'Connections',
    icon: 'plug',
    body: ConnectionsPage,
    id: 'connections',
  })*/
  .addConfigPage({
    title: 'Configuration',
    icon: 'cog',
    body: AppConfig,
    id: 'configuration',
  });
