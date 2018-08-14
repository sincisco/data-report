import {AfterViewInit, Component} from '@angular/core';
import {ExplicitRegion} from '@core/node/region/explicit.region';
import {ReportCanvas} from '@core/node/canvas/report.canvas';

@Component({
  selector: 'app-body',
  templateUrl: './app.body.component.html',
  styleUrls: ['./app.body.component.less']
})
export class AppBodyComponent implements AfterViewInit {

  report;

  ngAfterViewInit() {
    var report = this.report = new ReportCanvas();
    report.addChild(new ExplicitRegion());
    $('.app-content').prepend(report.$element);

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


