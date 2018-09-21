import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LayoutModule } from './layout/layout.module';
import { SystemModule } from './system/syetem.module';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { CoreModule } from './guard/core.module';
import { HeaderInterceptor } from './guard/header-interceptor';

registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    LayoutModule,
    SystemModule,
    LoginModule,
    CoreModule,
    SystemModule,
    AppRoutingModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
