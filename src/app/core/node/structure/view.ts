import {IEventTarget} from '@core/node/event/event';
import {IModel} from '../../../components/page.config/page.model';

export interface IView extends IEventTarget {
  $element: JQuery;

  // 模型到视图
  listenToModel(model: IModel);

  destroy();
}
