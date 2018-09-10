import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ColorPickerModule} from '@shared/color-picker/color-picker.module';

import {TitleConfigComponent} from './title.config.component';
import {AxisConfigComponent} from './axis.config.component';
import {GridConfigComponent} from './grid.config.component';
import {BarSeriesConfigComponent} from './series/bar.series.config.component';
import {BarSeriesManagerConfigComponent} from './bar.series.manager.config.component';
import {HorizontalPositionDirective, VerticalPositionDirective} from './title.config.validator';
import {ControlMonitorDirective} from '../../directives/control.monitor.directive';
import {ControlDividerComponent} from '../common/control.divider.component';
import {ColorConfigComponent} from './color.config.component';
import {LineSeriesConfigComponent} from './series/line.series.config.component';
import {LineSeriesManagerConfigComponent} from './line.series.manager.config.component';
import {PieSeriesConfigComponent} from './series/pie.series.config.component';
import {PieSeriesManagerConfigComponent} from './pie.series.manager.config.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {SimpleColorPickerComponent} from '../common/simple.color.picker.component';
import {MultiColorInputComponent} from '../common/multi.color.input.component';


const COMPONENTS = [
  ControlDividerComponent,
  SimpleColorPickerComponent,
  MultiColorInputComponent,
  AxisConfigComponent,
  BarSeriesConfigComponent,
  LineSeriesConfigComponent,
  PieSeriesConfigComponent,
  TitleConfigComponent,
  GridConfigComponent,
  BarSeriesManagerConfigComponent,
  LineSeriesManagerConfigComponent,
  PieSeriesManagerConfigComponent,
  ColorConfigComponent
];

const DIRECTIVES = [
  ControlMonitorDirective,
  HorizontalPositionDirective,
  VerticalPositionDirective
];

@NgModule({
  declarations: [
    ...COMPONENTS, ...DIRECTIVES
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ColorPickerModule,
    NgZorroAntdModule,
    OverlayModule
  ],
  entryComponents: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS, ...DIRECTIVES
  ]
})
export class ConfigModule {
}
