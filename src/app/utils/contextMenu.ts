import * as _ from 'lodash';

const windowMask = `
<div class="m-window m-window-mask mask-transparent" style="z-index: 405;">
  <div class="wrap">
  </div>
</div>
`;

export interface ContextMenuItem {
  displayName: string;
  icon?: string;
  position?: string;
  _callbackNo?: string;
  // callback如果return false的话 自动关闭右键上下文菜单
  callback?: Function;
  enable?: boolean;
  shortcut?: string;
  children?: Array<ContextMenuItem>;
}

function getContextMenu(array: Array<ContextMenuItem | string>, root?: boolean): string {
  const items = array.reduce((previousValue, currentValue) => {
    return previousValue + getContextMenuItem(currentValue);
  }, '');
  return `<ul ${root === true ? '' : 'class="subMenu right bottom"'}>${items}</ul>`;
}

function getContextMenuItem(item: ContextMenuItem | string): string {
  if (typeof item === 'string') {
    return item === 'split' ? `<li class="u-split"></li>` : '';
  } else {
    if (item.callback) {
      item._callbackNo = _.uniqueId('callback_');
    }
    return `<li data-callback-no="${item._callbackNo}" class="${item.enable === false ? 'z-disabled' : 'z-clickable'}">
            ${item.icon ? '<i class="u-icn ' + item.icon + '"></i>' : ''}
            ${item.displayName}
            ${item.shortcut ? '<span class="shortcut">' + item.shortcut + '</span>' : ''}
            ${(item.children && item.children.length > 0) ? '<span class="u-icn u-icn-angle-right"></span>' +
      getContextMenu(item.children) : ''}
          </li>`;
  }
}

function getTemplate(array: Array<ContextMenuItem | string>) {
  return `
  <div class="m-overlay  top" style="z-index: 406; position: absolute;">
    <div class="container" style="zoom: 1;">
      <div class="m-ctxMenu">
          ${getContextMenu(array, true)}
      </div>
    </div>
  </div>
`;
}

function visit(array: Array<ContextMenuItem | string>,
               callback: (item: ContextMenuItem | string,
                          parentMenum: ContextMenuItem, depth?: number) => void) {
  const inFn = (list: Array<ContextMenuItem | string>, parentMenu: ContextMenuItem, depth: number) => {
    for (const item of list) {
      callback(item, parentMenu, depth);
      if (typeof item !== 'string' && item.children && item.children.length > 0) {
        inFn(item.children, item, depth + 1);
      }
    }
  };

  inFn(array, null, 0);
}

function searchCallback(array: Array<ContextMenuItem | string>, key: string) {

}

class ContextMenu {
  $mask: JQuery;
  $menu: JQuery;

  callback: Function;

  constructor() {
    this.$mask = $(windowMask);
    this.$mask.click(($event) => {
      this.close();
      if ($event.target === this.$mask[0]) {

      }
    });
  }

  open(array: Array<ContextMenuItem | string>, pageX: number, pageY: number, $event: JQuery.Event | MouseEvent, demo?: boolean) {
    this.$menu = $(getTemplate(array));
    if (demo) {
      this.$menu.css({
        left: `${$event.pageX - 180}px`,
        top: `${$event.pageY}px`
      });
    } else {
      this.$menu.css({
        left: `${$event.pageX}px`,
        top: `${$event.pageY}px`
      });
    }

    this.$menu.on('click', 'li.z-clickable', ($itemEvent) => {
      console.log($itemEvent.currentTarget.dataset.callbackNo);
      const callbackNo = $itemEvent.currentTarget.dataset.callbackNo;
      if (callbackNo === 'undefined') {
        return false;
      }
      visit(array, (item) => {
        if (typeof item !== 'string' && item._callbackNo === callbackNo) {
          if (item.callback($event) === false) {
            this.close();
          }
        }
      });
      return false;
    });
    $('body').append(this.$mask).append(this.$menu);

  }

  openWithEvent(array: Array<ContextMenuItem | string>, $event: JQuery.Event | MouseEvent) {
    this.$menu = $(getTemplate(array));
    this.$menu.css({
      left: `${$event.pageX}px`,
      top: `${$event.pageY}px`
    });
    this.$menu.on('click', 'li.z-clickable', ($itemEvent) => {
      console.log($itemEvent.currentTarget.dataset.callbackNo);
      const callbackNo = $itemEvent.currentTarget.dataset.callbackNo;
      if (callbackNo === 'undefined') {
        return false;
      }
      visit(array, (item) => {
        if (typeof item !== 'string' && item._callbackNo === callbackNo) {
          if (item.callback($event) === false) {
            this.close();
          }
        }
      });
      return false;
    });
    $('body').append(this.$mask).append(this.$menu);

  }

  close(callback?: Function) {
    if (callback) {
      callback();
    }
    if (this.callback) {
      this.callback();
      this.callback = null;
    }
    this.$mask.detach();
    this.$menu.remove();
  }

}

export const contextMenuHelper = new ContextMenu();
