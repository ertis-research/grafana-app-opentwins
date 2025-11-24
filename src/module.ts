import './css/bootstrap-grid.css';
//import './css/bootstrap-utilities.css';
//import './css/bootstrap.css';
import './css/bootstrap-cards.css';
import './css/bootstrap-basics.css';
import './css/main.css';
import { AppPlugin } from '@grafana/data';
import { AppConfig } from 'config/AppConfig';
import { RootPage } from 'RootPage';

export const plugin = new AppPlugin<{}>().setRootPage(RootPage).addConfigPage({
  title: 'Configuration',
  icon: 'cog',
  body: AppConfig,
  id: 'config',
});
