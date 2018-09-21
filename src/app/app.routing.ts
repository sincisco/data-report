import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from './system/personal-center/personal-center.component';
import {DesignerComponent} from './layout/designer.component';

const routes: Routes = [
  { path: '', component: DesignerComponent },
  { path: 'designer', component: DesignerComponent },
  { path: '**', component: PersonalCenterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
