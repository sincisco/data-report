import {Observable} from 'rxjs';

export interface IConfigSourceFactory {
  getConfigSource(configOption: any): Observable<any>;
}
