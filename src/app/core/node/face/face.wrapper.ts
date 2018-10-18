import {ComponentRef, Type} from '@angular/core';
import {EchartFace} from '@core/node/face/echart.face';
import {DesignGraphicConfig} from '../../source/config.source/design.config.source';
import {session} from '@core/node/utils/session';

export class FaceWrapper {
  private _face: EchartFace;

  private _configComponentRef: ComponentRef<DesignGraphicConfig>;

  constructor(private _element: HTMLElement) {

  }

  create(contentClass: Type<EchartFace>) {
    this._element.classList.remove('no-chart');
    this._face = new contentClass(this._element);

    this._configComponentRef = session.siderLeftComponent.forwardCreateGraphicConfig(this._face.configClass);
  }

  resize() {
    if (this._face) {
      this._face.resize();
    }
  }

  update(option) {
    if (this._face) {
      this._face.update(option);
    }
  }

  activate() {
    if (!this._face) {
      return;
    }
    if (!this._configComponentRef) {
      this._configComponentRef = session.siderLeftComponent.createGraphicConfig(this._face.configClass);
    } else {
      session.siderLeftComponent.attachDataProperty(this._configComponentRef.hostView);
    }
    if (this._face) {
      this._face.activate();
    }
  }

  render() {

  }

  destroy() {
    if (this._face) {
      this._face.destroy();
    }
  }
}
