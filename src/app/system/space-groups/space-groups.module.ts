import { NgModule } from '@angular/core';
import { SpaceGroupsComponent } from './space-groups.component';
import { SystemService } from '../system.service';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SpaceGroupsRoutingModule } from './space-groups.routing';

const components = [SpaceGroupsComponent];

@NgModule({
  imports: [CommonModule, NgZorroAntdModule, SpaceGroupsRoutingModule],
  exports: [...components],
  declarations: [...components],
  providers: [SystemService]
})
export class SpaceGroupsModule {}
