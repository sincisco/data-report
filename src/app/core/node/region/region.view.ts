import {View} from '@core/node/structure/view';

export abstract class RegionView extends View {
  $fill: JQuery;

  abstract refresh();

  select() {
    this.$element.addClass('selected');
  }

  multiSelect() {
    this.$element.addClass('multi-selected');
  }

  /**
   * 点击画布  所有的region、调用unselect方法
   */
  unselect() {
    this.$element.removeClass('selected');
  }

  multiUnselect() {
    this.$element.removeClass('multi-selected');
  }

}
