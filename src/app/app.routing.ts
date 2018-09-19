import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCenterComponent } from './system/personal-center/personal-center.component';

const routes: Routes = [
  { path: '', component: PersonalCenterComponent },
  { path: '**', component: PersonalCenterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
