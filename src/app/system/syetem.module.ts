import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SpaceManageService } from './space-manage/space-manage.service';
import { SpaceGroupsModule } from './space-groups/space-groups.module';
import { SystemRoutingModule } from './system.routing';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { SpaceManageComponent } from './space-manage/space-manage.component';
import { AuthGuard } from '../guard/auth-guard.service';
const modules = [CommonModule, NgZorroAntdModule, SpaceGroupsModule, SystemRoutingModule];
const components = [PersonalCenterComponent, SpaceManageComponent];

@NgModule({
  imports: [...modules],
  exports: [...components],
  declarations: [...components],
  providers: [SpaceManageService, AuthGuard]
})
export class SystemModule {
  constructor() {}
}
