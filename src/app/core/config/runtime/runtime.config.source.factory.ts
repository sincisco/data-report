import {IConfigSourceFactory} from '../config.source.factory';
import {BehaviorSubject, of} from 'rxjs';

export class RuntimeConfigSourceFactory implements IConfigSourceFactory {
  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new RuntimeConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  private constructor() {
  }

  getConfigSource(configSourceOption: { graphicId: string, graphicKey: string, configOption: any }) {
    return new BehaviorSubject({
      key: 'option',
      newValue: configSourceOption.configOption,
      oldValue: configSourceOption.configOption,
      option: configSourceOption.configOption
    });
  }
}
