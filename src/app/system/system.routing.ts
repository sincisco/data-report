import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { SpaceGroupsComponent } from './space-groups/space-groups.component';
import { SpaceManageComponent } from './space-manage/space-manage.component';
import { AuthGuard } from '../guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'i',
        component: PersonalCenterComponent,
        loadChildren: './personal-center/person-center.module#PersonCenterModule'
      },
      {
        path: 'groups',
        component: SpaceGroupsComponent
      },
      {
        path: 'groups/:id',
        component: SpaceManageComponent,
        loadChildren: './space-manage/space-manage.module#SpaceManageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
