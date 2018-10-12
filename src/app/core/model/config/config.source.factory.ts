import {Observable} from 'rxjs';

export interface IConfigSourceFactory {
  create(configMeta: any): Observable<any>;
}
