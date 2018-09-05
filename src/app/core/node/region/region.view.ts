import {View} from '@core/node/structure/view';

export abstract class RegionView extends View {
  $fill: JQuery;

  abstract refresh();
}
