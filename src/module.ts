import { ComponentClass } from 'react';
import { ExampleConfigCtrl } from './legacy/config';
import { AppPlugin, AppRootProps } from '@grafana/data';
//import { ConnectionsPage } from './pages/connectionPage';
import { ExamplePage2 } from './config/ExamplePage2';
import { ExampleRootPage } from './ExampleRootPage';
import { ExampleAppSettings } from './types';
import './css/bootstrap-grid.css';
//import './css/bootstrap-utilities.css';
//import './css/bootstrap.css';
import './css/bootstrap-cards.css';
import './css/bootstrap-basics.css';

export { ExampleConfigCtrl as ConfigCtrl };

export const plugin = new AppPlugin<ExampleAppSettings>()
  .setRootPage((ExampleRootPage as unknown) as ComponentClass<AppRootProps>)
/*  .addConfigPage({
    title: 'Connections',
    icon: 'plug',
    body: ConnectionsPage,
    id: 'connections',
  })*/
  .addConfigPage({
    title: 'Page 2',
    icon: 'user',
    body: ExamplePage2,
    id: 'page2',
  });
