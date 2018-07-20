import {IDimensions, INode} from './interface';
import {ContextMenuHelper} from '../utils/contextMenu';
import {ExplicitRegion} from "./region.explicit";
import {RegionText} from "./region.text";
import {Region} from "./region";




export class Report implements INode {
  template = `
<div class="report-region">
    <div class="report-canvas">
      <div class="report-box">
         <div class="report-grid">
         </div>
      </div>
    </div>
</div>
    `;
  dimension: IDimensions = {
    width: 960,
    height: 720
  };
  _scale: number = 1;

  $element: JQuery;
  $region: JQuery;
  $canvas: JQuery;
  $box: JQuery;
  $grid: JQuery;

  constructor() {
    this.$element = this.$region = $(this.template);
    this.$canvas = this.$element.find('.report-canvas');
    this.$box = this.$element.find('.report-box');
    this.$grid = this.$element.find('.report-grid');
    this.refresh();

    this.$grid.contextmenu(($event: JQuery.Event) => {
      ContextMenuHelper.open([
        {
          displayName: '新建图表',
          callback: () => {
            console.log('新建图表');
            var graphNode = new ExplicitRegion();
            graphNode.coordinates($event.offsetX, $event.offsetY);
            graphNode.refresh();
            this.addChild(graphNode);
            ContextMenuHelper.close();
          }
        },{
          displayName: '新建文本',
          callback: () => {
            console.log('新建图表');
            var graphNode = new RegionText();
            graphNode.coordinates($event.offsetX, $event.offsetY);
            graphNode.refresh();
            this.addChild(graphNode);
            ContextMenuHelper.close();
          }
        }, {
          displayName: '剪切',
          shortcut: 'Ctrl+X'
        }, {
          displayName: '删除',
          shortcut: 'Backspace'
        }, 'split',
        {
          displayName: '创建'
        }
      ], $event);
      return false;
    });


    this._init()
  }

  private _init() {
    this.$grid.click(($event)=>{
      console.log('click');
      if($event.target===this.$grid[0]){
        this.select();
      }
    })
  }

  set width(width: number) {
    this.dimension.width = width;
  }

  set height(height: number) {
    this.dimension.height = height;
  }

  get scale() {
    return this._scale;
  }

  set scale(param: number) {
    this._scale = param / 100;
    this.refresh();
  }

  refresh() {
    const width = this.dimension.width, height = this.dimension.height;

    this._setDim(this.$region, width * this.scale + 50, height * this.scale + 30);
    this._setDim(this.$canvas, width * this.scale, height * this.scale);
    this.$box.css('transform', `translate(-50%, -50%) scale(${this.scale})`);
    this._setDim(this.$grid, width, height);
  }

  private _setDim($ele, width, height) {
    $ele.css('width', width).css('height', height);
  }

  private children:Array<Region>=[];

  addChild(child: Region) {
    child.report = this;
    this.children.push(child);
    this.$grid.append(child.$element);
  }

  select(){
    this.children.forEach((value)=>{
      value.unselect();
    })
  }

  unselect(){

  }
}

class RootNode implements INode {
  template = `
<div class="report-canvas">
</div>
    `;
}
