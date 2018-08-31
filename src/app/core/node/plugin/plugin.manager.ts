import {IPlugin} from '@core/node/plugin/plugin';
import {IPage} from '@core/node/interface';
import {EventBus} from '@core/node/event/event.bus';

export class PluginManager {
  constructor(private _page: IPage) {

  }

  register(plugin: IPlugin) {
    const eventBus = EventBus.getInstance(this._page);
    plugin.listen(eventBus);
  }

  registerPlugins(plugins: Array<IPlugin>) {
    const eventBus = EventBus.getInstance(this._page);
    plugins.forEach((plugin) => {
      plugin.listen(eventBus);
    });
  }

}
