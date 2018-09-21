import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ReportCollectManageComponent } from './component-manage/report-collect-manage.component';
import { ScreenCollectManageComponent } from './component-manage/screen-collect-manage.component';
import { PersonalMessageManageComponent } from './component-manage/personal-message-manage.component';

const routes: Routes = [

      { path: 'manage/report', component: ReportCollectManageComponent },
      { path: 'manage/screen', component: ScreenCollectManageComponent },
      { path: 'manage/user', component: PersonalMessageManageComponent }
];

export const PersonCenterRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
