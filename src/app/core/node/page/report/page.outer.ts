import {ReportPageInner} from '@core/node/page/report/page.inner';
import {session} from '@core/node/utils/session';
import {PageConfigComponent} from '../../../../components/page.config/page.config.component';
import {graphicFactory} from '@core/node/factory/graphic.factory';
import {ComponentRef} from '@angular/core';
import {PageConfig} from '../../../../components/page.config/page.config';
import {IReportPage} from '@core/node/page/report/page.interface';
import {ReportPage} from '@core/node/page/report/page';

export class PageConfigWrapper {
  constructor(private _inner: ComponentRef<PageConfig> | PageConfig) {
  }

  get model(): PageConfig {
    if (this._inner instanceof PageConfig) {
      return this._inner;
    } else {
      return this._inner.instance;
    }
  }

  show() {
    if (this._inner instanceof PageConfig) {

    } else {
      session.siderLeftComponent.attachDataProperty(this._inner.hostView);
    }
  }

  hide() {

  }

  destroy() {
    if (this._inner instanceof PageConfig) {
    } else {
      this._inner.destroy();
    }
  }
}


export class ReportPageOuter {

  private _pageConfigWrapper: PageConfigWrapper;
  private _pageInner: ReportPageInner;
  private _page: IReportPage;

  constructor(modelType: 'design' | 'runtime') {
    switch (modelType) {
      case 'design':
        this._pageConfigWrapper = new PageConfigWrapper(session.siderLeftComponent.forwardCreateCanvasConfig(PageConfigComponent));
        this._pageInner = new ReportPageInner(this._pageConfigWrapper);
        this._pageInner.init();
        this._page = new ReportPage(this._pageInner);
        break;
      case 'runtime':
        break;
    }
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
    return this._pageConfigWrapper.model;
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
    if (this._pageConfigWrapper) {
      this._pageConfigWrapper.destroy();
      this._pageConfigWrapper = null;
    }
    if (this._page) {
      this._page.destroy();
      this._page = null;
    }

  }

}
