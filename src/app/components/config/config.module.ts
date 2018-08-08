import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ColorPickerModule} from '@shared/color-picker/color-picker.module';

import {TitleConfigComponent} from './title.config.component';
import {AxisConfigComponent} from './axis.config.component';
import {GridConfigComponent} from './grid.config.component';
import {BarSeriesConfigComponent} from './series/bar.series.config.component';
import {SeriesConfigComponent} from './series.config.component';


const COMPONENTS = [
  AxisConfigComponent,
  BarSeriesConfigComponent,
  TitleConfigComponent,
  GridConfigComponent,
  SeriesConfigComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ColorPickerModule,
    NgZorroAntdModule
  ],
  entryComponents: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class ConfigModule {
}
