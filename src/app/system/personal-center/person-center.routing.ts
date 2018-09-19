import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {PersonalCenterComponent} from './personal-center.component';
import {ReportCollectManageComponent} from './component-manage/report-collect-manage.component';
import {ScreenCollectManageComponent} from './component-manage/screen-collect-manage.component';
import {PersonalMessageManageComponent} from './component-manage/personal-message-manage.component';


const routes: Routes = [
  {
    path: 'i', component: PersonalCenterComponent,
    children: [
      {path: 'report', component: ReportCollectManageComponent},
      {path: 'screen', component: ScreenCollectManageComponent},
      {path: 'user', component: PersonalMessageManageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonCenterRoutingModule {
}
