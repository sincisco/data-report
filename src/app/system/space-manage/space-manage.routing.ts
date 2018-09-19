import { SpaceManageComponent } from './space-manage.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoleManageComponent } from './manage-component/role-manage/role-manage.component';
import { ReportManageComponent } from './manage-component/report-manage/report-manage.component';
import { UserManageComponent } from './manage-component/user-manage/user-manage.component';
import { ReportDetailComponent } from './manage-component/report-detail/report-detail.componet';
import { ScreenManageComponent } from './manage-component/screen-manage/screen-manage.component';

const routes: Routes = [
  {
    path: 'groups/:id',
    component: SpaceManageComponent,
    children: [
      { path: 'reportDetail', component: ReportDetailComponent },
      { path: 'manage/role', component: RoleManageComponent },
      { path: 'manage/report', component: ReportManageComponent },
      { path: 'manage/user', component: UserManageComponent },
      { path: 'manage/dashboard', component: ScreenManageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceRoutingModule {}
