import {ReportPage} from '@core/node/page/report/page';
import {session} from '@core/node/utils/session';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {ComponentRef} from '@angular/core';
import {PageConfig} from '../../../../components/page.config/page.config';

export class ReportPageWrapper {

  private _configComponentRef: ComponentRef<PageConfig>;
  private _page: ReportPage;

  constructor() {
    this._configComponentRef = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);


    this._page = new ReportPage( this._configComponentRef);
  }

  get model() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }

  init() {

    this._page.accept(this.model);
  }

  load(option: any) {
    this.model.importOption(option.option);
    option.children.forEach((value) => {
      graphicFactory.paste(value);
    });
  }

  save() {
    return {
      option: this.model.exportOption(),
      // children: this.regionManager.saveAs()
    };
  }

  enterFullScreen() {
    // this._$box[0].requestFullscreen();
  }

  destroy() {
    this._configComponentRef.destroy();
    this._configComponentRef = null;
  }

}
