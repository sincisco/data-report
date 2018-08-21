import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {HttpClientModule} from '@angular/common/http';
import {PieConfigComponent} from './chart/pie.config.component';
import {DataHeaderComponent} from './html/header.component';
import {ColorPickerModule} from '@shared/color-picker/color-picker.module';

import {CommentConfigComponent} from './auxiliary/comment.config.component';
import {TextConfigComponent} from './auxiliary/text.config.component';

import {ImageConfigComponent} from './html/image.config.component';
import {BarConfigComponent} from './chart/bar.config.component';
import {NzModalFilterComponent} from './common/filter.modal.component';
import {FilterListComponent} from './common/filter.list.component';
import {ConfigModule} from '../../../components/config/config.module';
import {PageConfigComponent} from '../page.config/page.config.component';
import {LineConfigComponent} from './chart/line.config.component';
import {BuildInConfigComponent} from '../page.config/build-in.config.component';
import {ImageSelectConfigComponent} from '../page.config/image.select.config.component';

const COMPONENTS = [
  PieConfigComponent,
  BarConfigComponent,
  LineConfigComponent,
  DataHeaderComponent,
  TextConfigComponent,
  CommentConfigComponent,
  ImageConfigComponent,
  NzModalFilterComponent,
  FilterListComponent,
  BuildInConfigComponent,
  ImageSelectConfigComponent,
  PageConfigComponent
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
    NgZorroAntdModule,
    ConfigModule
  ],
  entryComponents: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class GraphicConfigModule {
}
