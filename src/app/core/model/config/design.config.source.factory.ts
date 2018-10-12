import {IConfigSourceFactory} from '@core/model/config/config.source.factory';
import {Observable} from 'rxjs';

export class DesignConfigSourceFactory implements IConfigSourceFactory {
  create(configMeta: any): Observable<any> {
    return null;
  }
}
