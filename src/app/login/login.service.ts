import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  // bakUrl = 'http://localhost:3000/';
  url = 'http://10.2.215.213:8080/data-report/';
  constructor(private httpClient: HttpClient) {}
  login(params): Observable<any> {
    return this.httpClient.post(this.url + 'login', params);
  }
}
