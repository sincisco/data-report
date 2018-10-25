import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DesignerHeaderComponent} from './designer.header.component';
import {DesignerBodyComponent} from './designer.body.component';
import {SiderLeftComponent} from './sider/sider.left.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {HttpClientModule} from '@angular/common/http';
import {ColorPickerModule} from '@shared/color-picker/color-picker.module';
import {SchemaPillsComponent} from './sider/model/schema.component';
import {SiderRightComponent} from './sider/sider.right.component';
import {ConfigModule} from '../components/config/config.module';
import {GraphicConfigModule} from '../components/graphic.config/graphic.config.module';
import {DimensionAreaComponent} from './sider/model/dimension.area.component';
import {MeasureAreaComponent} from './sider/model/measure.area.component';
import {DesignerComponent} from './designer.component';
import {DesignerBodyLeftComponent} from './designer.body.left.component';
import {PaletteComponent} from './part/palette.component';
import {OutlineComponent} from './part/outline.component';

const COMPONENTS = [
  DesignerComponent,
  DesignerHeaderComponent,
  DesignerBodyComponent,
  DesignerBodyLeftComponent,
  PaletteComponent,
  OutlineComponent,
  SiderLeftComponent,
  SiderRightComponent,
  // SchemaPillsComponent,
  DimensionAreaComponent,
  MeasureAreaComponent
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
    NgZorroAntdModule,
    ColorPickerModule,
    ConfigModule,
    GraphicConfigModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class LayoutModule {
}
