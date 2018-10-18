import {IConfigSourceFactory} from './config.source.factory';
import {session} from '../node/utils/session';
import {DesignGraphicConfig} from '../source/config.source/design.config.source';
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
    configComponentRef.instance.importOption(option);
    GraphicConfigManager.getInstance().add(graphicId, configComponentRef);


    return configComponentRef.instance.configSource;
  }
}

export class GraphicConfigManager {
  private static _graphicConfigManager: GraphicConfigManager;
  private _map = new Map();

  static getInstance() {
    return this._graphicConfigManager = this._graphicConfigManager || new GraphicConfigManager();
  }

  private constructor() {
  }

  add(id: string, graphicConfig: ComponentRef<DesignGraphicConfig>) {
    this._map.set(id, graphicConfig);
  }

  activate(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      session.siderLeftComponent.attachDataProperty(componentRef.hostView);
    }
  }

  remove(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      componentRef.destroy();
      this._map.delete(id);
    }
  }
}
