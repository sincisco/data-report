import {KeyValueDiffers} from '@angular/core';
import {SiderLeftComponent} from '../../../layout/sider/sider.left.component';
import {GraphicConfig} from '@core/config/design/graphic.config';
import {ReportPage} from '@core/node/page/report/page';

class Session {
  differs: KeyValueDiffers;
  currentPage: ReportPage;
  currentGraphicConfig: GraphicConfig;
  siderLeftComponent: SiderLeftComponent;
}

export const session = new Session();
