import * as _ from 'lodash';
import {datasetManager} from '@core/dataset/dataset.manager';

const windowMask = `
<div class="m-window m-window-mask mask-transparent" style="z-index: 405;">
  <div class="wrap">
  </div>
</div>
`;

interface ContextMenuItem {
  displayName: string,
  _callbackNo?: string,
  callback?: Function,
  enable?: boolean,
  shortcut?: string,
  children?: Array<ContextMenuItem>
}


function getTemplate() {

  const result = datasetManager.list.reduce((previous, current) => {
    return previous + `<li class="model-item" data-model-name="${current}">${current}<i class="u-icn u-icn-delete"></i><i class="u-icn u-icn-check"></i></li>`;
  }, '');

  return `
<div class="m-overlay m-overlay-dataModel top" style="z-index: 409; position: absolute; top: 138px; left: 1206.6px; width: 167px;">
      <div class="u-overlay-blank" style="zoom: 1;">
        <button class="add-dataModel"><i class="u-icn u-icn-add"></i>添加新数据模型</button>
        <ul class="model-list">
            ${result}
        </ul>
      </div>
    
</div>
`;
}

class DataModelList {
  $mask: JQuery;
  $menu: JQuery;

  constructor() {
    this.$mask = $(windowMask);
    this.$mask.click(($event) => {
      this.close();
      if ($event.target === this.$mask[0]) {

      }
    });
  }

  open($event: MouseEvent, callback?: Function) {
    console.log($event);
    this.$menu = $(getTemplate());
    this.$menu.css({
      left: `${(<HTMLElement>$event.target).offsetLeft}px`,
      top: `${(<HTMLElement>$event.target).offsetTop + (<HTMLElement>$event.target).offsetHeight}px`
    });
    this.$menu.on('click', 'li.model-item', ($event) => {
      console.log($event.currentTarget.dataset.modelName);
      callback && callback($event.currentTarget.dataset.modelName);
      this.close();

      return false;
    });
    $('body').append(this.$mask).append(this.$menu);

  }

  close() {
    this.$mask.detach();
    this.$menu.remove();
  }
}

export const dataModelList = new DataModelList();
