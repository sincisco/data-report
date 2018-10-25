import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DesignerComponent} from './layout/designer.component';

const routes: Routes = [
  { path: '', component: DesignerComponent },
  { path: 'designer', component: DesignerComponent },
  { path: '**', component: DesignerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
