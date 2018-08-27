import {AfterViewInit, Component} from '@angular/core';
import {ReportPage} from '@core/node/canvas/report/report.page';
import {Split} from '@core/node/canvas/dashboard/split';
import {DashboardCanvas} from '@core/node/canvas/dashboard/dashboard.canvas';
import {session} from '@core/node/utils/session';

@Component({
  selector: 'app-body',
  templateUrl: './app.body.component.html',
  styleUrls: ['./app.body.component.less']
})
export class AppBodyComponent implements AfterViewInit {

  report;

  ngAfterViewInit() {
    const report = this.report = session.currentPage = ReportPage.builder();
    $('.app-content').prepend(report.$element);

    // const dashboardCanvas = new DashboardCanvas();
    // $('.app-content').prepend(dashboardCanvas.$element);
    return;
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    console.log('****', event);
    this.report.scale = event;
  }

}


