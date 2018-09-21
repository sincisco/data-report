import { NgModule } from '@angular/core';
import { LoginGuard } from './login-guard.service';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [LoginGuard, AuthGuard, AuthService]
})
export class CoreModule {}
