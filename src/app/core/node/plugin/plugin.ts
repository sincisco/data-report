import {EventBus} from '@core/node/event/event.bus';

export interface IPlugin {
  listen(eventBus: EventBus);
}
