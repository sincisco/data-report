import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SpaceRoutingModule } from './space-manage.routing';
import { RoleManageComponent } from './manage-component/role-manage/role-manage.component';
import { ReportManageComponent } from './manage-component/report-manage/report-manage.component';
import { UserManageComponent } from './manage-component/user-manage/user-manage.component';
import { ReportDetailComponent } from './manage-component/report-detail/report-detail.componet';

import { SpaceManageService } from './space-manage.service';
import { SystemService } from '../system.service';

import { ScreenManageComponent } from './manage-component/screen-manage/screen-manage.component';
import { CreateNewpageComponent } from './manage-component/report-manage/components/create-newpage.component';
import { AddUserComponent } from './manage-component/user-manage/components/add-user.component';
import { AddRoleComponent } from './manage-component/role-manage/components/add-role.component';

const components = [
  RoleManageComponent,
  ReportManageComponent,
  UserManageComponent,
  ReportDetailComponent,
  ScreenManageComponent,
];
const modal = [CreateNewpageComponent, AddUserComponent, AddRoleComponent];

@NgModule({
  imports: [NgZorroAntdModule, CommonModule, SpaceRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [...components],
  declarations: [...components, ...modal],
  providers: [SpaceManageService, SystemService],
  entryComponents: [...modal]
})
export class SpaceManageModule {
  constructor() {}
}
