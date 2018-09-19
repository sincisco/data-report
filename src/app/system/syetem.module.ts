import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SpaceManageModule } from './space-manage/space-manage.module';
import { PersonCenterModule } from './personal-center/person-center.module';
import { SpaceManageService } from './space-manage/space-manage.service';
import { SpaceGroupsModule } from './space-groups/space-groups.module';
const modules = [CommonModule, NgZorroAntdModule, SpaceManageModule, PersonCenterModule, SpaceGroupsModule];
const components = [];

@NgModule({
  imports: [...modules],
  exports: [...components],
  declarations: [...components],
  providers: [SpaceManageService]
})
export class SystemModule {
  constructor() {}
}
