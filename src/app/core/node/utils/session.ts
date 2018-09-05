import {KeyValueDiffers} from '@angular/core';
import {ReportPage} from '@core/node/page/report/page';

class Session {
  differs: KeyValueDiffers;
  currentPage: ReportPage;
}

export const session = new Session();
