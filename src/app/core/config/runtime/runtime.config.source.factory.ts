import {IConfigSourceFactory} from '../config.source.factory';
import {of} from 'rxjs';

export class RuntimeConfigSourceFactory implements IConfigSourceFactory {
  getConfigSource(configMeta: any) {
    return of(configMeta);
  }
}
