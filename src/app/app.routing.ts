import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DesignerComponent} from './layout/designer.component';

const routes: Routes = [
  { path: '', component: DesignerComponent },
  { path: 'designer', component: DesignerComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: DesignerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
