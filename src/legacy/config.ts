import { PluginMeta } from '@grafana/data';
import { setDittoEndpoint, setDittoExtendedAPIEndpoint, setHonoEndpoint, setHonoTenant } from 'utils/data/variables';

export class ExampleConfigCtrl {
  static templateUrl = 'legacy/configTemplate.html'

  appEditCtrl: any;
  appModel?: PluginMeta;

  /** @ngInject */
  constructor($scope: any, $injector: any) {
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));

    // Make sure it has a JSON Data spot
    if (!this.appModel) {
      this.appModel = {} as PluginMeta;
    }

    // Required until we get the types sorted on appModel :(
    const appModel = this.appModel as any;
    if (!appModel.jsonData) {
      appModel.jsonData = {};
    } else {
      if(appModel.jsonData.ditto_endpoint) setDittoEndpoint(appModel.jsonData.ditto_endpoint)
      if(appModel.jsonData.ditto_extended_endpoint) setDittoExtendedAPIEndpoint(appModel.jsonData.ditto_extended_endpoint)
      if(appModel.jsonData.hono_endpoint) setHonoEndpoint(appModel.jsonData.hono_endpoint)
      if(appModel.jsonData.hono_tenant) setHonoTenant(appModel.jsonData.hono_tenant)
    }

    console.log('ExampleConfigCtrl', this);
  }

  postUpdate() {
    if (!this.appModel?.enabled) {
      console.log('Not enabled...');
      return;
    }
    // TODO, can do stuff after update
    console.log('Post Update:', this);
  }
}
