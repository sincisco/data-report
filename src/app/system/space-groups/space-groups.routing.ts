import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpaceGroupsComponent } from './space-groups.component';
import { SpaceManageComponent } from '../space-manage/space-manage.component';

const routes: Routes = [
  {
    path: 'groups',
    component: SpaceGroupsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceGroupsRoutingModule {}
