import {KeyValueDiffers} from '@angular/core';
import {ReportPage} from '@core/node/page/report/page';
import {SiderLeftComponent} from '../../../layout/sider/sider.left.component';
import {GraphicConfig} from '@core/source/config.source/graphic.config';

class Session {
  differs: KeyValueDiffers;
  currentPage: ReportPage;
  currentGraphicConfig: GraphicConfig;
  siderLeftComponent: SiderLeftComponent;
}

export const session = new Session();
