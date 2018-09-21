import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PersonCenterRoutingModule } from './person-center.routing';
import { PersonalMessageManageComponent } from './component-manage/personal-message-manage.component';
import { ReportCollectManageComponent } from './component-manage/report-collect-manage.component';
import { ScreenCollectManageComponent } from './component-manage/screen-collect-manage.component';
import { SystemService } from '../system.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../guard/auth-guard.service';

const components = [PersonalMessageManageComponent, ReportCollectManageComponent, ScreenCollectManageComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PersonCenterRoutingModule, NgZorroAntdModule],
  exports: [...components],
  declarations: [...components],
  providers: [SystemService, AuthGuard]
})
export class PersonCenterModule {
  constructor() {}
}
