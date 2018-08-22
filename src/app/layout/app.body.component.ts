import {AfterViewInit, Component} from '@angular/core';
import {ExplicitRegion} from '@core/node/region/explicit.region';
import {ReportPage} from '@core/node/canvas/report/report.page';
import {Split} from '@core/node/canvas/dashboard/split';
import {DashboardCanvas} from '@core/node/canvas/dashboard/dashboard.canvas';

export let currentReport: ReportPage;

@Component({
  selector: 'app-body',
  templateUrl: './app.body.component.html',
  styleUrls: ['./app.body.component.less']
})
export class AppBodyComponent implements AfterViewInit {

  report;

  ngAfterViewInit() {
    var report = this.report = currentReport = new ReportPage();
    report.addChild(new ExplicitRegion());
    $('.app-content').prepend(report.$element);

    // const dashboardCanvas = new DashboardCanvas();
    // $('.app-content').prepend(dashboardCanvas.$element);
    return;
  }

  private _chart;

  get chart() {
    return this._chart;
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    console.log('****', event);
    this.report.scale = event;
  }

}


