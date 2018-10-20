import {IConfigSourceFactory} from '../config.source.factory';
import {session} from '../../node/utils/session';
import {DesignGraphicConfig} from '../../source/config.source/design.config.source';
import {ComponentRef, Type} from '@angular/core';
import {GraphicConfigManager} from '@core/config/design/graphic.config.manager';

export class DesignConfigSourceFactory implements IConfigSourceFactory {

  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new DesignConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  private constructor() {
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


