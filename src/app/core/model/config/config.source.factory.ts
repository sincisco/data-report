import {Observable} from 'rxjs';

export interface IConfigSourceFactory {
  getConfigSource(configMeta: any);
}
