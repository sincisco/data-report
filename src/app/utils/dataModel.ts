import {dataModelManager} from '@core/data/data.model.manager';

const windowMask = `
<div class="m-window m-window-mask mask-transparent" style="z-index: 405;">
  <div class="wrap">
  </div>
</div>
`;

interface ContextMenuItem {
  displayName: string;
  _callbackNo?: string;
  callback?: Function;
  enable?: boolean;
  shortcut?: string;
  children?: Array<ContextMenuItem>;
}


function getTemplate() {

  const result = dataModelManager.list.reduce((previous, current) => {
    return previous +
      `<li class="model-item" data-model-id="${current.id}">${current.displayName}
<i class="u-icn u-icn-delete"></i>
<i class="u-icn u-icn-check"></i>
</li>`;
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

class DataModelPopupList {
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

  open(event: MouseEvent, callback?: Function) {
    console.log(event);
    this.$menu = $(getTemplate());
    this.$menu.css({
      left: `${(<HTMLElement>event.target).offsetLeft}px`,
      top: `${(<HTMLElement>event.target).offsetTop + (<HTMLElement>event.target).offsetHeight}px`
    });
    this.$menu.on('click', 'li.model-item', ($event) => {
      console.log($event.currentTarget.dataset.modelId);
      callback && callback($event.currentTarget.dataset.modelId);
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

export const dataModelList = new DataModelPopupList();
