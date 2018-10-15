import {IConfigSourceFactory} from '@core/model/config/config.source.factory';
import {session} from '@core/node/utils/session';
import {DesignConfigSource} from '@core/node/source/config.source/design.config.source';
import {Type} from '@angular/core';

export class DesignConfigSourceFactory implements IConfigSourceFactory {

  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new DesignConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  getConfigSource(configOption: { graphicConfigClass: Type<DesignConfigSource>, option: any }) {
    const {graphicConfigClass, option} = configOption,
      configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(graphicConfigClass);

    // 步骤四
    if (option) {
      configComponentRef.instance.importOption(option);
    }
  }
}
