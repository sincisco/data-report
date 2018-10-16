import {IConfigSourceFactory} from '@core/model/config/config.source.factory';
import {session} from '@core/node/utils/session';
import {DesignGraphicConfig} from '@core/node/source/config.source/design.config.source';
import {ComponentRef, Type} from '@angular/core';

export class DesignConfigSourceFactory implements IConfigSourceFactory {

  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new DesignConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  getConfigSource(configOption: { graphicId: string, graphicConfigClass: Type<DesignGraphicConfig>, option: any }) {
    const {graphicId, graphicConfigClass, option} = configOption,
      configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(graphicConfigClass);

    // 步骤四
    if (option) {
      configComponentRef.instance.importOption(option);
    }

    return configComponentRef.instance.configSource;
  }
}

class GraphicConfigManager {
  private static _graphicConfigManager: GraphicConfigManager;
  private _map = new Map();

  static getInstance() {
    return this._graphicConfigManager = this._graphicConfigManager || new GraphicConfigManager();
  }

  private constructor() {
  }

  save(id: string, graphicConfig: ComponentRef<DesignGraphicConfig>) {
    this._map.set(id, graphicConfig);
  }
}
