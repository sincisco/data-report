import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SystemService {
  // url = 'http://localhost:3000';
  url = 'http://10.2.215.213:8080/data-report/';
  private eventemit = new Subject();
  eventemit$ = this.eventemit.asObservable();
  constructor(private http: HttpClient) {}
  listenEvent(value) {
    this.eventemit.next(value);
  }
  getSpaces(): Observable<any> {
    return this.http.get(this.url + 'api/square/list');
  }
  getReportsBySpaceId(spaceId): Observable<any> {
    return this.http.get(this.url + '/getReportsBySpaceId/' + spaceId);
  }
}
