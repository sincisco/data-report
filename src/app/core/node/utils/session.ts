import {KeyValueDiffers} from '@angular/core';
import {SiderLeftComponent} from '../../../layout/sider/sider.left.component';
import {GraphicConfig} from '@core/config/design/graphic.config';
import {ReportPageInner} from '@core/node/page/report/page.inner';
import {ReportPageOuter} from '@core/node/page/report/page.outer';

class Session {
  differs: KeyValueDiffers;
  currentPage: ReportPageOuter;
  currentGraphicConfig: GraphicConfig;
  siderLeftComponent: SiderLeftComponent;
}

export const session = new Session();
