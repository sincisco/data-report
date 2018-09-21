import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// TODO: 验证用户是否登录
@Injectable()
export class AuthService {
  isLogin = false;
  constructor() {}
  login(): Observable<any> {
    return of(true);
  }
  logout() {
    this.isLogin = false;
  }
}
