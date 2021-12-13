import { ComponentClass } from 'react';
import { ExampleConfigCtrl } from './legacy/config';
import { AppPlugin, AppRootProps } from '@grafana/data';
import { GeneralPage } from './config/General';
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
  .addConfigPage({
    title: 'Connections',
    icon: 'info-circle',
    body: GeneralPage,
    id: 'general',
  })
  .addConfigPage({
    title: 'Page 2',
    icon: 'user',
    body: ExamplePage2,
    id: 'page2',
  });
