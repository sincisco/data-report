import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Token = localStorage.getItem('Token');
    const authToken = Token || '';
    const newReq = req.clone({ setHeaders: { Token: authToken } });
    return next.handle(newReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body.token) {
            localStorage.setItem('Token', event.body.token);
          }
        }
        return event;
      })
    );
  }
}
