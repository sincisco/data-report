import {AfterViewInit, Component} from '@angular/core';
import {currentReport} from './app.body.component';
import {graphicFactory} from '@core/node/factory/graphic.factory';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.less']
})
export class AppHeaderComponent implements AfterViewInit {

  helperToolsPopup: PopupWrapper;
  filterToolsPopup: PopupWrapper;
  moreToolsPopup: PopupWrapper;

  mouseEnter(event: MouseEvent, popupWrapper: PopupWrapper, offsetLeft: number) {
    popupWrapper.show($(event.currentTarget).offset().left - offsetLeft);
  }

  mouseLeave() {
    console.log('mouseLeave');
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
    <div class="placeholder" style="height: 68px;left: 56px;right: 56px;"></div>
    <ul class="btns-box">
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
    this._$element.find('.btn-item.draggable').on('dragstart', ($event: JQuery.Event) => {
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
      componentName = (<HTMLElement>$event.target).dataset.componentName;
      return false;
    });

    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.show(event.pageX - 150, event.pageY - 100);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, currentReport.$grid.offset());

      graphicFactory.createByName(componentName, currentReport,
        event.pageX - currentReport.$grid.offset().left - 150,
        event.pageY - currentReport.$grid.offset().top - 100);
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


const grabTemplate = `<div class="m-chart-grabing"
 style="width: 300px; height: 200px;
 background-color: rgb(36, 148, 232);
 background-image: url(&quot;https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg&quot;);
 background-repeat: no-repeat; background-position: center center;
 background-size: 320px 224px; z-index: 1000; position: absolute;opacity: 0.5;cursor: grabbing;
 left: 122px; top: 206px;">
 <div class="g-grab-fill"></div><div class="g-grab-fill u-mover"></div>
 </div>
`;

class GrabHelper {
  private readonly _$element: JQuery;

  private _state = false;

  constructor(template: string) {
    this._$element = $(template);
  }

  show(left: number, top: number) {
    if (!this._state) {
      $('body').append(this._$element);
      this._state = true;
    }
    this._$element.css({
      left,
      top
    });
  }

  hidden() {
    this._$element.detach();
    this._state = false;
  }
}

export const grabHelper = new GrabHelper(grabTemplate);
