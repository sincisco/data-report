import {Split} from '@core/node/page/dashboard/split';

export const NOOP = () => false;

// Save a couple long function names that are used frequently.
// This optimization saves around 400 bytes.
export const addEventListener1 = 'addEventListener';
export const getBoundingClientRect = 'getBoundingClientRect';
export const HORIZONTAL = 'horizontal';

// Helper function checks if its argument is a string-like type
export const isString = v => (typeof v === 'string' || v instanceof String);

// Helper function determines which prefixes of CSS calc we need.
// We only need to do this once on startup, when this anonymous function is called.
//
// Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
// http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167
const calc = (['', '-webkit-', '-moz-', '-o-'].filter(function (prefix) {
  const el = document.createElement('div');
  el.style.cssText = 'width:' + prefix + 'calc(9px)';

  return (!!el.style.length);
}).shift()) + 'calc';

export class DashboardCanvas {
  $element: JQuery;
  $grid: JQuery;

  root: Split;
  template = `
<div class="m-dashRegion dragable" style="width: 820px; height: 550px;">
  <div class="m-canvas z-selected" style="width: 760px; height: 520px; background: transparent;">
    <div class="g-fill canvas-fill dropable">
      <div class="box" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 4px 0px; transform: translate(-50%, -50%); overflow: visible;">
      <div class="grid canvas" style="width: 760px; height: 520px;">
      </div>
      </div>
    </div>
  </div>
</div>
  `;

  constructor() {
    this.$element = $(this.template);
    this.$grid = this.$element.find('.grid');
    this.root = new Split(this.$grid[0], {sizes: [30, 50, 20], direction: 'vertical'});
  }
}

// var propertyGrid = new PropertyGrid($('#propertygrid'));

// $('#preview-btn').click(function (event) {
//   $('.canvas').toggleClass('preview').toggleClass('designer');
//   if ($('.canvas').hasClass('preview')) {
//     globalSplit.start();
//   } else {
//     globalSplit.stop();
//   }
// });
