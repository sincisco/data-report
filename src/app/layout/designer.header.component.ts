import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {session} from '@core/node/utils/session';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import {customGraphicMeta, graphicMetaMap, totalGraphicMetaMap} from '@core/node/config/default.graphic.meta.map';

@Component({
  selector: 'app-designer-header',
  templateUrl: './designer.header.component.html',
  styleUrls: ['./designer.header.component.less']
})
export class DesignerHeaderComponent implements AfterViewInit {

  helperToolsPopup: PopupWrapper;
  filterToolsPopup: PopupWrapper;
  moreToolsPopup: PopupWrapper;
  @Output() switch = new EventEmitter();

  mouseEnter(event: MouseEvent, popupWrapper: PopupWrapper, offsetLeft: number) {
    popupWrapper.show($(event.currentTarget).offset().left - offsetLeft);
  }

  preview() {
    session.currentPage.enterFullScreen();
  }

  get actionManager() {
    return session.currentPage ? session.currentPage.actionManager : null;
  }

  doSave() {
    const blob = new Blob([JSON.stringify(session.currentPage.save(), null, 2)], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, `zijin.template.${moment().format('YYYYMMDDHHmmss')}.json`);
  }

  templateChange(event: Event) {
    const that = this;
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    // this.option.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (<any>evt.target).result;
      console.log(text);
      session.currentPage.load(JSON.parse(text));
      (<HTMLFormElement>file.parentElement).reset();
    };
    reader.readAsText(file.files[0]);
  }

  change(event: Event) {
    const option: any = {
      preserveAspectRatio: false,
      backgroundColor: undefined,
      borderStyle: 'solid',
      borderColor: '#aaa',
      borderWidth: 0,
      borderRadius: 0,
      image: {
        width: 400,
        height: 300,
        url: '',
        dataUrl: ''
      }
    };
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    option.image.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      option.image.dataUrl = (<any>evt.target).result;
      const image = new Image();
      image.src = (<any>evt.target).result;
      image.onload = function () {
        option.image.width = (<HTMLImageElement>this).naturalWidth;
        option.image.height = (<HTMLImageElement>this).naturalHeight;
        if (session.currentPage) {
          const ret = graphicFactory.newGraphicByName('imageAuxiliary', session.currentPage, 200, 200, option);
        }
      };

      (<HTMLFormElement>file.parentElement).reset();

    };
    reader.readAsDataURL(file.files[0]);
  }

  dragStart(dragEvent: DragEvent) {
    let componentName: string;
    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, session.currentPage.offset());

      graphicFactory.createByName(componentName, session.currentPage,
        event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
      grabHelper.hidden();
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    componentName = (<HTMLElement>event.target).dataset.componentName;
    grabHelper.show(dragEvent.pageX, dragEvent.pageY,
      totalGraphicMetaMap[componentName].grabOption);
    return false;
  }

  doSwitch(event) {
    this.switch.emit();
  }

  ngAfterViewInit() {
    this.helperToolsPopup = helperToolsPopup;
    this.filterToolsPopup = filterToolsPopup;
    this.moreToolsPopup = moreToolsPopup;
  }

}


const HelperTools = `
<div class="m-overlay  bottom"
     style="display:none;z-index: 405; position: absolute; top: 68px; left: 455px;">
  <div class="m-classMenu " style="zoom: 1;">
    <div class="placeholder" style="height: 68px;"></div>
    <ul class="btns-box">
      <li class="btn-item draggable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-rect"></i>
          <span class="text">矩形</span>
        </div>
      </li>
      <li class="btn-item draggable" draggable="true" data-component-name="textAuxiliary">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-text"></i>
          <span class="text">文本</span>
        </div>
      </li>
      <li class="btn-item draggable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-tab"></i>
          <span class="text">Tab</span>
        </div>
      </li>
      <li class="btn-item draggable" draggable="true" data-component-name="commentAuxiliary">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-comment"></i>
          <span class="text">注释框</span>
        </div>
      </li>
    </ul>
  </div>
</div>
`;

const FilterTools = `
<div class="m-overlay  bottom"
     style="display:none; z-index: 406; position: absolute; top: 68px; left: 564px;">
  <div class="m-classMenu " style="zoom: 1;">
    <div class="placeholder" style="height: 68px;left: 12px;right: 12px;"></div>
    <ul class="btns-box">
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-list"></i>
          <span class="text">列表筛选</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-range"></i>
          <span class="text">范围筛选</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-date"></i>
          <span class="text">日期筛选</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-treeFilter"></i>
          <span class="text">树状筛选</span>
        </div>
      </li>
    </ul>
  </div>

</div>
`;

const MoreTools = `
<div class="m-overlay  bottom" style="display:none; z-index: 406; position: absolute; top: 68px; left: 342px;">
  <!--inlcude-->
  <div class="m-classMenu m-classMenu-more" style="zoom: 1;">
    <div class="placeholder" style="height: 68px;left: 94px;right: 94px;"></div>
    <ul class="btns-box">
    <li class="btn-item draggable" draggable="true" data-component-name="lineChart">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-chart-line"></i>
          <span class="text">折线图</span>
        </div>
      </li>
      <li class="btn-item draggable" draggable="true" data-component-name="clock">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-chart-area"></i>
          <span class="text">区域图</span>
        </div>
      </li>
      <li class="btn-item draggable" draggable="true" data-component-name="pieChart">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-chart-pie"></i>
          <span class="text">饼状图</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-meter"></i>
          <span class="text">仪表图</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-indicator"></i>
          <span class="text">指标卡</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-funnel"></i>
          <span class="text">漏斗图</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-radar"></i>
          <span class="text">雷达图</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-sankey"></i>
          <span class="text">桑基图</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-heatmap"></i>
          <span class="text">热力地图</span>
        </div>
      </li>
      <li class="btn-item dragable">
        <div class="u-tool-btn">
          <i class="u-icn u-icn-menubar-sunburst"></i>
          <span class="text">旭日图</span>
        </div>
      </li>
    </ul>
  </div>
</div>

`;

class PopupWrapper {
  private readonly _$element: JQuery;

  constructor(template: string) {
    this._$element = $(template);
    $('body').append(this._$element);

    this._init();
  }

  private _init() {
    let componentName: string;
    this._$element.mouseleave(() => {
      this._$element.hide();
    });
    this._$element.find('.btn-item.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        componentName = (<HTMLElement>$event.target).dataset.componentName;

        grabHelper.show($event.pageX, $event.pageY, totalGraphicMetaMap[componentName].grabOption);
        return false;
      });

    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, session.currentPage.offset());

      graphicFactory.createByName(componentName, session.currentPage,
        event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
      grabHelper.hidden();
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }

  show(left: number) {
    this._$element.css({left}).show();
  }

  hide() {
    this._$element.hide();
  }
}

const helperToolsPopup = new PopupWrapper(HelperTools);
const filterToolsPopup = new PopupWrapper(FilterTools);
const moreToolsPopup = new PopupWrapper(MoreTools);

document.addEventListener('click', (event) => {
  helperToolsPopup.hide();
  filterToolsPopup.hide();
  moreToolsPopup.hide();
});

const grabTemplate = `<div class="m-chart-grabing"
 style="width: 300px; height: 200px;
 background-color: rgb(36, 148, 232);
 background-image: url('https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg');
 background-repeat: no-repeat; background-position: center center;
 background-size: 320px 224px; z-index: 1000; position: absolute;opacity: 0.5;cursor: grabbing;
 left: 122px; top: 206px;">
 <div class="g-grab-fill"></div><div class="g-grab-fill u-mover"></div>
 </div>
`;

class GrabHelper {
  private readonly _$element: JQuery;

  private _state = false;
  private _defaultOption = {
    width: 300,
    height: 200,
    backgroundImage: 'url("https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg")',
    backgroundSize: '320px 224px'
  };
  private _option;

  constructor(template: string) {
    this._$element = $(template);
  }

  get offsetX() {
    return this._option.width / 2;
  }

  get offsetY() {
    return this._option.height / 2;
  }

  show(left: number, top: number, option?: { width: number, height: number, backgroundImage: string }) {
    this._option = option ? option : this._defaultOption;
    this._$element.css(this._option);
    this._$element.css({backgroundSize: `${this._option.width}px ${this._option.height}px`});
    if (!this._state) {
      $('body').append(this._$element);
      this._state = true;
    }
    this._$element.css({
      left: left - this.offsetX,
      top: top - this.offsetY
    });
  }

  refresh(left: number, top: number) {
    this._$element.css({
      left: left - this.offsetX,
      top: top - this.offsetY
    });
  }

  hidden() {
    this._option = null;
    this._$element.detach();
    this._state = false;
  }
}

export const grabHelper = new GrabHelper(grabTemplate);
