import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {HttpClientModule} from '@angular/common/http';
import {DataPieComponent} from './chart/data.pie.component';
import {DataHeaderComponent} from './html/header.component';
import {ColorPickerModule} from '@shared/color-picker/color-picker.module';
import {DataParagraphComponent} from './html/paragraph.component';
import {DataImageComponent} from './html/image.component';
import {DataBarComponent} from "./chart/data.bar.component";

const COMPONENTS = [
  DataPieComponent,
  DataBarComponent,
  DataHeaderComponent,
  DataParagraphComponent,
  DataImageComponent
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
export class PropertyDataModule {
}
