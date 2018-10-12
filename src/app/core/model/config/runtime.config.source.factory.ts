import {IConfigSourceFactory} from 'config.source.factory';
import {of} from 'rxjs';

export class RuntimeConfigSourceFactory implements IConfigSourceFactory {
  create(configMeta: any) {
    return of(configMeta);
  }
}
