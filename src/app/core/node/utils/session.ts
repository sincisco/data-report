import {KeyValueDiffers} from '@angular/core';
import {SiderLeftComponent} from '../../../layout/sider/sider.left.component';
import {GraphicConfig} from '@core/config/design/graphic.config';
import {ReportPageInner} from '@core/node/page/report/page.inner';
import {ReportPageOuter} from '@core/node/page/report/page.outer';
import {Subject} from 'rxjs';

class Session {
  differs: KeyValueDiffers;
  private _currentPage: ReportPageOuter;
  currentGraphicConfig: GraphicConfig;
  siderLeftComponent: SiderLeftComponent;
  pageChange = new Subject();

  set currentPage(value: ReportPageOuter) {
    this._currentPage = value;
    this.pageChange.next(value.reportPage);
  }

  get currentPage() {
    return this._currentPage;
  }
}

export const session = new Session();
