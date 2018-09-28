import {KeyValueDiffers} from '@angular/core';
import {ReportPage} from '@core/node/page/report/page';
import {SiderLeftComponent} from '../../../layout/sider/sider.left.component';

class Session {
  differs: KeyValueDiffers;
  currentPage: ReportPage;
  siderLeftComponent: SiderLeftComponent;
}

export const session = new Session();
