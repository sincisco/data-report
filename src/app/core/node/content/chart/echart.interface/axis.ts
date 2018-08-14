import {TextStyle} from './text.style';
import {LineStyle} from './line.style';
import {Border, Font, Shadow, TextShadow} from './common';

type AxisType = 'category' | 'value' | 'time' | 'log';

interface AxisNameTextStyle extends TextStyle {
  backgroundColor?: string | { image: string };
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | Array<number>;
  padding?: number | Array<number>;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

interface AxisLine {
  show?: boolean;
  onZero?: boolean;
  // 当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上。
  onZeroAxisIndex?: number;
  // [ default: 'none' ]
  // 轴线两边的箭头。可以是字符串，表示两端使用同样的箭头；
  // 或者长度为 2 的字符串数组，
  // 分别表示两端的箭头。默认不显示箭头，即 'none'。
  // 两端都显示箭头可以设置为 'arrow'，只在末端显示箭头可以设置为 ['none', 'arrow']。
  symbol?: string | Array<string>;
  // [ default: [10, 15] ]
  // 轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）。
  symbolSize?: Array<number>;
  // [ default: [0, 0] ]
  // 轴线两边的箭头的偏移，
  // 如果是数组，第一个数字表示起始箭头的偏移，第二个数字表示末端箭头的偏移；
  // 如果是数字，表示这两个箭头使用同样的偏移。
  symbolOffset?: Array<number> | number;
  lineStyle?: LineStyle;
}

interface AxisTick {
  show?: boolean;
  alignWithLabel?: boolean;
  interval?: number | Function | 'auto';
  // [ default: false ]
  // 坐标轴刻度是否朝内，默认朝外。
  inside?: boolean;
  // [ default: 5 ]
  // 坐标轴刻度的长度。
  length?: number;
  lineStyle?: LineStyle;
}

interface AxisLabel extends Font, Border, Shadow, TextShadow {
  show?: boolean;
  interval?: number;
  inside?: boolean;
  rotate?: number;
  margin?: number;
  formatter?: string | Function;
  showMinLabel?: boolean;
  showMaxLabel?: boolean;
  backgroundColor?: string;
  padding?: number | Array<number>;
  width?: number | string;
  height?: number | string;
  textBorderColor?: string;
  textBorderWidth?: number;
}

interface SplitLine {
  // [ default: true ]
  // 是否显示分隔线。默认数值轴显示，类目轴不显示。
  show?: boolean;
  interval?: string;
  lineStyle?: LineStyle;
}

interface AreaStyle extends Shadow {
  color?: string;
  opacity?: number;
}

interface SplitArea {
  show?: boolean;
  interval?: number | Function;
  areaStyle?: AreaStyle;
}

export interface Axis {
  // 组件 ID。默认不指定。指定则可用于在 option 或者 API 中引用组件。
  id?: string;
  // [ default: true ]
  // 是否显示 x 轴。
  show?: boolean;
  // [ default: 0 ]
  // x 轴所在的 grid 的索引，默认位于第一个 grid。
  gridIndex?: number;
  // 默认 grid 中的第一个 x 轴在 grid 的下方（'bottom'），第二个 x 轴视第一个 x 轴的位置放在另一侧。
  position?: 'top' | 'bottom' | undefined | null;
  // [ default: 0 ]
  // X 轴相对于默认位置的偏移，在相同的 position 上有多个 X 轴的时候有用。
  offset?: number;
  // [ default: 'category' ]
  // 坐标轴类型。
  // 可选：
  // 'value' 数值轴，适用于连续数据。
  // 'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
  // 'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
  // 'log' 对数轴。适用于对数数据
  type?: AxisType;
  // 坐标轴名称。
  name?: string;
  // [ default: 'end' ]
  // 坐标轴名称显示位置。
  // 可选：
  // 'start'
  // 'middle' 或者 'center'
  // 'end'
  nameLocation?: 'start' | 'middle' | 'end';
  // 坐标轴名称的文字样式。
  nameTextStyle?: AxisNameTextStyle;
  // [ default: 15 ]
  // 坐标轴名称与轴线之间的距离
  nameGap?: number;
  // [ default: null ]
  // 坐标轴名字旋转，角度值。
  nameRotate?: number;
  // [ default: false ]
  // 是否是反向坐标轴。ECharts 3 中新加。
  inverse?: boolean;
  // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
  // 类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
  // 非类目轴，包括时间，数值，对数轴，boundaryGap是一个两个值的数组，分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效。 示例：
  // boundaryGap: ['20%', '20%']
  boundaryGap?: boolean | Array<string>;
  min?: string | number;
  max?: string | number;
  scale?: boolean;
  // [ default: 5 ]
  // 坐标轴的分割段数，需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
  // 在类目轴中无效。
  splitNumber?: number;
  // [ default: 0 ]
  // 自动计算的坐标轴最小间隔大小。
  // 例如可以设置成1保证坐标轴分割刻度显示成整数
  minInterval?: number;
  maxInterval?: number;
  interval?: number;
  logBase?: number;
  silent?: boolean;
  // [ default: false ]
  // 坐标轴的标签是否响应和触发鼠标事件，默认不响应。
  triggerEvent?: boolean;
  axisLine?: AxisLine;
  axisTick?: AxisTick;
  axisLabel?: AxisLabel;
  splitLine?: SplitLine;
  splitArea?: SplitArea;
}

