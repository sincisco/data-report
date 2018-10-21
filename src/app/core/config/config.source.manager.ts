import {IConfigSourceFactory} from '@core/config/config.source.factory';
import {DesignConfigSourceFactory} from '@core/config/design/design.config.source.factory';
import {RuntimeConfigSourceFactory} from '@core/config/runtime/runtime.config.source.factory';
import {Observable} from 'rxjs';

export class ConfigSourceManager {
  private _configSourceFactory: IConfigSourceFactory;

  constructor(modelSourceFactoryType: 'design' | 'runtime') {
    switch (modelSourceFactoryType) {
      case 'design':
        this._configSourceFactory = DesignConfigSourceFactory.getInstance();
        break;
      case 'runtime':
        this._configSourceFactory = RuntimeConfigSourceFactory.getInstance();
        break;
    }
  }

  getModelSource(configSourceOption: any): Observable<any> {
    return this._configSourceFactory.getConfigSource(configSourceOption);
  }
}
