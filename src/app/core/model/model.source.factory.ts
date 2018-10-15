import {DataSourceFactory} from '@core/model/data/data.source.factory';
import {IConfigSourceFactory} from '@core/model/config/config.source.factory';
import {DesignConfigSourceFactory} from '@core/model/config/design.config.source.factory';
import {RuntimeConfigSourceFactory} from '@core/model/config/runtime.config.source.factory';

export class ModelSourceFactory {
  private static _modelSourceFactoryForDesign: ModelSourceFactory;
  private static _modelSourceFactoryForRuntime: ModelSourceFactory;

  private _configSourceFactory: IConfigSourceFactory;

  static getInstance(modelSourceFactoryType: 'design' | 'runtime'): ModelSourceFactory {
    let modelSourceFactory: ModelSourceFactory;
    switch (modelSourceFactoryType) {
      case 'design':
        if (!this._modelSourceFactoryForDesign) {
          this._modelSourceFactoryForDesign = new ModelSourceFactory(modelSourceFactoryType);
        }
        modelSourceFactory = this._modelSourceFactoryForDesign;
        break;
      case 'runtime':
        if (!this._modelSourceFactoryForRuntime) {
          this._modelSourceFactoryForRuntime = new ModelSourceFactory(modelSourceFactoryType);
        }
        modelSourceFactory = this._modelSourceFactoryForRuntime;
        break;
    }
    return modelSourceFactory;
  }

  constructor(modelSourceFactoryType: 'design' | 'runtime') {
    switch (modelSourceFactoryType) {
      case 'design':
        this._configSourceFactory = new DesignConfigSourceFactory();
        break;
      case 'runtime':
        this._configSourceFactory = new RuntimeConfigSourceFactory();
        break;
    }
  }

  getModelSource(modelOption: ModelOption) {

    const configSource = this._configSourceFactory.getConfigSource(modelOption.configOption),
      dataSource = DataSourceFactory.getInstance().getDataSource(modelOption.dataOption);
  }
}

interface ModelOption {
  configOption: any;
  dataOption: any;
}
