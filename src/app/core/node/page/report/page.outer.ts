import {ReportPageInner} from '@core/node/page/report/page.inner';
import {session} from '@core/node/utils/session';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {ComponentRef} from '@angular/core';
import {PageConfig} from '../../../../components/page.config/page.config';
import {IReportPage} from '@core/node/page/report/page.interface';
import {ReportPage} from '@core/node/page/report/page';

export class ReportPageOuter {

  private _configComponentRef: ComponentRef<PageConfig>;
  private _pageInner: ReportPageInner;
  private _page: IReportPage;

  constructor() {
    this._configComponentRef = session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent);


    this._pageInner = new ReportPageInner(this._configComponentRef);
    this._pageInner.init();
    this._page = new ReportPage(this._pageInner);

  }

  get $element() {
    return this._pageInner.view.$element;
  }

  offset() {
    return this._pageInner.view.offset();
  }

  get reportPage(): IReportPage {
    return this._page;
  }


  get model() {
    return this._configComponentRef ? this._configComponentRef.instance : null;
  }

  get actionManager() {
    return this._pageInner.actionManager;
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
      children: this._pageInner.regionManager.saveAs()
    };
  }

  enterFullScreen() {
    this._pageInner.view.enterFullScreen();
  }

  destroy() {
    if (this._configComponentRef) {
      this._configComponentRef.destroy();
      this._configComponentRef = null;
    }
    if (this._page) {
      this._page.destroy();
      this._page = null;
    }

  }

}
